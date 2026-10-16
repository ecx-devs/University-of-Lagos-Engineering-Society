'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  getAllAdminBlogPosts,
  createOrUpdateBlogPost,
  toggleBlogPostPublished,
  deleteBlogPost,
  type BlogPostData,
} from '@/app/actions/blogs';
import { uploadToCloudinary } from '@/app/actions/upload';
import { compressImageFile } from '@/lib/image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Trash2,
  UploadCloud,
  Loader2,
  Edit,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Clock,
  Sparkles,
  Tag,
} from 'lucide-react';

const blogFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().optional(),
  release: z.string().min(1, 'Release/Series tag is required (e.g., Release #01)'),
  category: z.string().min(1, 'Category is required'),
  author: z.string().min(2, 'Author name is required'),
  authorBio: z.string().optional(),
  authorPfp: z.string().optional(),
  date: z.string().min(1, 'Display date is required (e.g., April 15, 2026)'),
  readTime: z.string().optional(),
  description: z.string().min(10, 'Summary/Description must be at least 10 characters'),
  body: z.string().min(20, 'Article body must be at least 20 characters'),
  imageUrl: z.string().min(1, 'Cover image is required. Please upload an image.'),
  imageAlt: z.string().optional(),
  isPublished: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const INITIAL_FORM_VALUES: BlogFormValues = {
  id: undefined,
  title: '',
  slug: '',
  release: 'Release #01',
  category: 'Campus Life',
  author: 'ULES Editorial',
  authorBio: 'The official voice and stories from the University of Lagos Engineering Society.',
  authorPfp: '/logo/logo-transparent.png',
  date: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
  readTime: '4 min read',
  description: '',
  body: '',
  imageUrl: '',
  imageAlt: '',
  isPublished: true,
};

export default function BlogAdminPage() {
  const [blogList, setBlogList] = useState<BlogPostData[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  const loadBlogs = async () => {
    const data = await getAllAdminBlogPosts();
    setBlogList(data);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    setFormFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: BlogFormValues) => {
    setFormFeedback(null);
    startTransition(async () => {
      const result = await createOrUpdateBlogPost({
        id: editingId || undefined,
        slug: values.slug?.trim() || undefined,
        title: values.title,
        release: values.release || 'Release #01',
        category: values.category || 'Campus Life',
        author: values.author || 'ULES Editorial',
        authorBio: values.authorBio,
        authorPfp: values.authorPfp || '/logo/logo-transparent.png',
        date: values.date,
        readTime: values.readTime,
        description: values.description,
        body: values.body,
        imageUrl: values.imageUrl,
        imageAlt: values.imageAlt || values.title,
        isPublished: values.isPublished,
      });

      if (result.success) {
        setFormFeedback({
          type: 'success',
          message: editingId ? 'Blog article updated successfully!' : 'New blog article created successfully!',
        });
        handleCancelEdit();
        await loadBlogs();
      } else {
        setFormFeedback({
          type: 'error',
          message: result.error || 'Failed to save blog article.',
        });
      }
    });
  };

  const handleEdit = (item: BlogPostData) => {
    setEditingId(item.id);
    setFormFeedback(null);
    form.reset({
      id: item.id,
      title: item.title,
      slug: item.slug,
      release: item.release || 'Release #01',
      category: item.category || 'Campus Life',
      author: item.author || 'ULES Editorial',
      authorBio: item.authorBio || '',
      authorPfp: item.authorPfp || '/logo/logo-transparent.png',
      date: item.date,
      readTime: item.readTime || '4 min read',
      description: item.description,
      body: item.body,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt || '',
      isPublished: item.isPublished,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      startTransition(async () => {
        await deleteBlogPost(id);
        if (editingId === id) handleCancelEdit();
        await loadBlogs();
      });
    }
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleBlogPostPublished(id, !currentStatus);
      await loadBlogs();
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormFeedback(null);

    try {
      // Compress large images in browser to ~250-400KB before network transfer
      const base64 = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.82,
      });
      const secureUrl = await uploadToCloudinary(base64, 'ules_blog');
      form.setValue('imageUrl', secureUrl, { shouldValidate: true });
    } catch (err: any) {
      console.error(err);
      setFormFeedback({
        type: 'error',
        message: 'Failed to upload image: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const imageUrl = form.watch('imageUrl');

  const filteredBlogs = blogList.filter((item) => {
    const matchesSearch =
      !filterQuery.trim() ||
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-7xl px-2 py-4 font-['Neue_Machina']">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#170A51]">Blog CMS</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C85B15]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C85B15]">
              <Sparkles className="size-3" /> Inbuilt System
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Create, edit, and publish dynamic articles for the ULES Blog under Stories.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            Total Articles: {blogList.length}
          </span>
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Published Live: {blogList.filter((b) => b.isPublished).length}
          </span>
          <span className="rounded-md bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            Drafts: {blogList.filter((b) => !b.isPublished).length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left Column: Form Section */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-[#170A51] flex items-center gap-2">
              <BookOpen className="size-5 text-[#C85B15]" />
              {editingId ? 'Edit Blog Post' : 'Write New Blog Post'}
            </h2>
            {editingId && (
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                Editing Mode
              </span>
            )}
          </div>

          {formFeedback && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
                formFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {formFeedback.type === 'success' ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-red-600" />
              )}
              <span>{formFeedback.message}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Post Title *</label>
              <Input placeholder="e.g. 5 Tips for Surviving First Year Engineering" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Category & Release Tag in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Category *</label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(val) => form.setValue('category', val || 'Campus Life', { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Campus Life">Campus Life</SelectItem>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Opinion">Opinion</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Release / Tag *</label>
                <Input placeholder="e.g. Release #01, Guide" {...form.register('release')} />
                {form.formState.errors.release && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.release.message}</p>
                )}
              </div>
            </div>

            {/* Author Name & Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Author Name *</label>
                <Input placeholder="e.g. Chiamaka Okonkwo" {...form.register('author')} />
                {form.formState.errors.author && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.author.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Read Time</label>
                <Input placeholder="e.g. 4 min read" {...form.register('readTime')} />
              </div>
            </div>

            {/* Author Bio */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Author Bio / Role <span className="text-xs font-normal text-gray-400">(shown on post page)</span>
              </label>
              <Input
                placeholder="e.g. Mechanical Engineering, 400L. ULES Content Lead."
                {...form.register('authorBio')}
              />
            </div>

            {/* Custom Slug & Display Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  URL Slug <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <Input placeholder="e.g. tips-first-year" {...form.register('slug')} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Display Date *</label>
                <Input placeholder="e.g. April 15, 2026" {...form.register('date')} />
                {form.formState.errors.date && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Short Summary / Lead Description */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Summary / Teaser *
              </label>
              <Textarea
                placeholder="Compelling 2-3 sentence overview that appears on blog cards and post header..."
                className="min-h-[80px] resize-y"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />

              {imageUrl ? (
                <div className="space-y-2">
                  <div className="relative h-44 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt="Cover preview"
                      fill
                      sizes="350px"
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-medium text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100"
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  >
                    <UploadCloud className="mr-1.5 size-3.5" /> Change Cover Image
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    uploadingImage
                      ? 'border-gray-300 bg-gray-50'
                      : 'border-[#C85B15]/40 bg-[#C85B15]/5 hover:border-[#C85B15] hover:bg-[#C85B15]/10'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Loader2 className="mb-1.5 size-5 animate-spin" />
                      <span className="text-xs">Uploading image to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-[#C85B15]">
                      <UploadCloud className="mb-1.5 size-7 opacity-80" />
                      <span className="text-xs font-semibold">Click to upload cover image</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">PNG, JPG, or WebP</span>
                    </div>
                  )}
                </div>
              )}
              {form.formState.errors.imageUrl && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>

            {/* Article Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700">Full Article Content *</label>
                <span className="text-[11px] text-muted-foreground">Markdown supported</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-1.5 leading-relaxed">
                Tip: Use <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">##</code> for Section Headings, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">&gt;</code> for Quotes, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">*</code> for Bullet points, and <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">--</code> for Author attributions.
              </p>
              <Textarea
                placeholder="Write the full blog article here...&#10;&#10;## Introduction&#10;Starting your engineering journey...&#10;&#10;> 'Engineering teaches resilience above all.'&#10;&#10;## Key Takeaways&#10;* Master your time blocking&#10;* Form study circles&#10;&#10;-- Author Name"
                className="min-h-[240px] resize-y font-sans text-sm leading-relaxed"
                {...form.register('body')}
              />
              {form.formState.errors.body && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.body.message}</p>
              )}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50/50">
              <div>
                <span className="text-sm font-semibold text-gray-800">Publish Immediately</span>
                <p className="text-xs text-gray-500">Make this blog post live on the website</p>
              </div>
              <input
                type="checkbox"
                className="size-5 rounded border-gray-300 text-[#170A51] focus:ring-[#170A51] cursor-pointer"
                {...form.register('isPublished')}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending || uploadingImage}
                className="flex-1 bg-[#170A51] text-white hover:bg-[#22203E] h-10 shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Publishing...'}
                  </>
                ) : editingId ? (
                  'Save Changes'
                ) : (
                  'Publish Post'
                )}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="h-10 text-gray-600 border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Blog Posts List Table */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#170A51]">Manage Published Posts</h2>
                <p className="text-xs text-gray-500">View, search, edit, or remove blog posts</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Campus Life', 'Tech', 'Career', 'Opinion'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                      categoryFilter.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#170A51] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, category, or snippet..."
                className="pl-9 text-sm"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            {/* Posts Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-16">Cover</TableHead>
                    <TableHead>Title & Release</TableHead>
                    <TableHead className="hidden md:table-cell">Category & Author</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <BookOpen className="size-8 text-gray-300" />
                          <p className="font-medium">No blog posts found</p>
                          <p className="text-xs text-gray-400">
                            {filterQuery || categoryFilter !== 'All'
                              ? 'Try adjusting your search query or category filter'
                              : 'Create your first post using the form on the left'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBlogs.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/70 transition-colors">
                        <TableCell>
                          <div className="relative size-12 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            <Image
                              src={item.imageUrl || '/blogs/my-first-love-letter.jpeg'}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[220px] sm:max-w-xs">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#C85B15]/10 text-[#C85B15]">
                                {item.release || 'Post'}
                              </span>
                              <span className="text-[11px] text-gray-400 font-mono">
                                /{item.slug}
                              </span>
                            </div>
                            <span className="block font-semibold text-gray-900 line-clamp-1 text-sm">
                              {item.title}
                            </span>
                            <span className="block text-xs text-gray-500 line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                              <Tag className="size-3 text-slate-400" />
                              {item.category}
                            </span>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="size-3 text-gray-400" />
                              <span className="truncate max-w-[120px]">{item.author}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-gray-500 whitespace-nowrap">
                          <div>{item.date}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="size-3" />
                            {item.readTime || '3 min'}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(item.id, item.isPublished)}
                            disabled={isPending}
                            title={item.isPublished ? 'Click to unpublish (draft)' : 'Click to publish live'}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              item.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {item.isPublished ? (
                              <>
                                <Eye className="size-3" /> Live
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3" /> Draft
                              </>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/stories/blog/${item.slug}`}
                              target="_blank"
                              title="View post on live website"
                              className="p-1.5 text-gray-500 hover:text-[#170A51] hover:bg-gray-100 rounded transition-colors"
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit post"
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.title)}
                              title="Delete post"
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
            <span>Showing {filteredBlogs.length} of {blogList.length} articles</span>
            <Link
              href="/stories/blog"
              target="_blank"
              className="text-[#170A51] hover:underline font-semibold flex items-center gap-1"
            >
              Preview Public Blog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
