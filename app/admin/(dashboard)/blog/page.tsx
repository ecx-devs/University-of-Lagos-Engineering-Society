'use client';

import { useState, useEffect, useTransition, useRef, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Plus,
  X,
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
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleOpenCreateModal = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    setFormFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: BlogPostData) => {
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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
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
        handleCloseModal();
        await loadBlogs();
      } else {
        setFormFeedback({
          type: 'error',
          message: result.error || 'Failed to save blog article.',
        });
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      startTransition(async () => {
        await deleteBlogPost(id);
        if (editingId === id) handleCloseModal();
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

  const filteredBlogs = useMemo(() => {
    return blogList.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [blogList, filterQuery, categoryFilter]);

  const liveCount = blogList.filter((b) => b.isPublished).length;

  return (
    <div className="space-y-6 font-['Neue_Machina']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
            Blog Posts CMS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Publish, curate, and edit student and engineering community articles.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <Link
            href="/activities/blog"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-[#C85B15] transition-colors border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-2xs"
          >
            <ExternalLink className="size-3.5" />
            <span>View Live</span>
          </Link>
          <Button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-none bg-[#C85B15] hover:bg-[#b04f12] text-white shadow-xs flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Blog Post</span>
          </Button>
        </div>
      </div>

      {/* Global Toast */}
      {formFeedback && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
            formFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {formFeedback.type === 'success' ? (
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm">{formFeedback.message}</div>
          <button
            onClick={() => setFormFeedback(null)}
            className="text-gray-400 hover:text-gray-700 text-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Controls: Search & Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by title, author, category, or slug..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg shadow-2xs w-full"
          />
        </div>

        {/* Category Pills - Scrollable on mobile without bursting container */}
        <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 text-xs shadow-2xs w-max">
            {['All', 'Campus Life', 'Tech', 'Career', 'Opinion'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#C85B15] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Blog Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[860px] w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                <TableHead className="w-16 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Cover</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[220px]">Post Title & Slug</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Category & Tag</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Author</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[130px]">Read Time & Date</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-center min-w-[90px]">Status</TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap text-right pr-4 min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredBlogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                    <BookOpen className="size-8 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">No blog posts found</p>
                    <p className="text-xs text-gray-500">
                      {filterQuery
                        ? 'Try clearing the search query or filter.'
                        : 'Click "Create Blog Post" above to write and publish an article.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBlogs.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/80 border-b border-gray-100 transition-colors">
                  {/* Cover */}
                  <TableCell className="py-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <Image
                        src={item.imageUrl || '/blogs/my-first-love-letter.jpeg'}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* Title & Slug */}
                  <TableCell className="py-3 min-w-[220px]">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">/activities/blog/{item.slug}</p>
                    </div>
                  </TableCell>

                  {/* Category & Release */}
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <span className="inline-flex items-center rounded-md bg-[#C85B15]/10 px-2 py-0.5 text-xs font-semibold text-[#C85B15] border border-[#C85B15]/20">
                        {item.category}
                      </span>
                      {item.release && (
                        <p className="text-[11px] text-gray-400 font-mono truncate">{item.release}</p>
                      )}
                    </div>
                  </TableCell>

                  {/* Author */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative size-6 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                        <Image
                          src={item.authorPfp || '/logo/logo-transparent.png'}
                          alt={item.author}
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{item.author}</span>
                    </div>
                  </TableCell>

                  {/* Read Time & Date */}
                  <TableCell className="py-3 text-xs text-gray-600 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <p className="font-medium text-gray-800">{item.date}</p>
                      <p className="text-[11px] text-gray-400">{item.readTime || '3 min read'}</p>
                    </div>
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell className="py-3 text-center">
                    <button
                      onClick={() => handleTogglePublish(item.id, item.isPublished)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                        item.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {item.isPublished ? (
                        <>
                          <Eye className="size-3" />
                          Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3" />
                          Draft
                        </>
                      )}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/activities/blog/${item.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-[#C85B15] hover:bg-gray-100 rounded-md transition-colors"
                        title="View Live Article"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(item)}
                        className="size-8 p-0 text-gray-500 hover:text-[#C85B15] hover:bg-[#C85B15]/10"
                        title="Edit Article"
                      >
                        <Edit className="size-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="size-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Article"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-6 py-4">
              <div>
                <h2 className="text-xl font-['Anton'] text-[#170A51] tracking-wide uppercase">
                  {editingId ? 'Edit Blog Post' : 'Write New Blog Post'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId
                    ? 'Update the article content, category metadata, or cover image'
                    : 'Compose a new article for the ULES student and tech community'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Post Title *
                </label>
                <Input
                  placeholder="e.g. 5 Tips for Surviving First Year Engineering"
                  {...form.register('title')}
                  className="bg-white"
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Category, Release & Slug in 3 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Category *
                  </label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(val) => form.setValue('category', val || 'Campus Life', { shouldValidate: true })}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Campus Life">Campus Life</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Opinion">Opinion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Release / Tag *
                  </label>
                  <Input placeholder="e.g. Release #01, Guide" {...form.register('release')} className="bg-white" />
                  {form.formState.errors.release && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.release.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    URL Slug <span className="text-[10px] font-normal text-gray-400">(optional)</span>
                  </label>
                  <Input placeholder="e.g. 5-tips-first-year" {...form.register('slug')} className="bg-white font-mono text-xs" />
                </div>
              </div>

              {/* Author Name, Read Time & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Author Name *
                  </label>
                  <Input placeholder="e.g. ULES Editorial" {...form.register('author')} className="bg-white" />
                  {form.formState.errors.author && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.author.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Estimated Read Time
                  </label>
                  <Input placeholder="e.g. 4 min read" {...form.register('readTime')} className="bg-white" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Display Date *
                  </label>
                  <Input placeholder="e.g. October 15, 2026" {...form.register('date')} className="bg-white" />
                  {form.formState.errors.date && (
                    <p className="mt-1 text-xs text-red-500">{form.formState.errors.date.message}</p>
                  )}
                </div>
              </div>

              {/* Author Bio */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Author Bio / Tagline <span className="text-[10px] font-normal text-gray-400">(optional)</span>
                </label>
                <Input
                  placeholder="Short one-line bio about the author or organization"
                  {...form.register('authorBio')}
                  className="bg-white"
                />
              </div>

              {/* Short Summary / Lead Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Summary / Teaser *
                </label>
                <Textarea
                  placeholder="Compelling 2-3 sentence overview that appears on blog cards and post header..."
                  className="min-h-[80px] resize-y bg-white"
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Cover Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />

                {imageUrl ? (
                  <div className="space-y-2">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-200 shadow-xs bg-gray-50">
                      <Image
                        src={imageUrl}
                        alt="Cover preview"
                        fill
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
                    className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                      uploadingImage
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-[#C85B15]/40 bg-[#C85B15]/5 hover:border-[#C85B15] hover:bg-[#C85B15]/10'
                    }`}
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center text-gray-500">
                        <Loader2 className="mb-1.5 size-5 animate-spin text-[#C85B15]" />
                        <span className="text-xs font-medium text-gray-700">Uploading image...</span>
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

              {/* Full Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Full Article Content *
                  </label>
                  <span className="text-[11px] text-muted-foreground">Markdown supported</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-1.5 leading-relaxed">
                  Tip: Use <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">##</code> for Section Headings, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">&gt;</code> for Quotes, <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">*</code> for Bullet points, and <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-700">--</code> for Author attributions.
                </p>
                <Textarea
                  placeholder="Write the full blog article here...&#10;&#10;## Introduction&#10;Starting your engineering journey...&#10;&#10;> 'Engineering teaches resilience above all.'&#10;&#10;## Key Takeaways&#10;* Master your time blocking&#10;* Form study circles&#10;&#10;-- Author Name"
                  className="min-h-[240px] resize-y font-sans text-sm leading-relaxed bg-white"
                  {...form.register('body')}
                />
                {form.formState.errors.body && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.body.message}</p>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-gray-50/50">
                <div>
                  <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Publish Live Immediately</span>
                  <p className="text-xs text-gray-500">Make this blog post visible to all engineering students</p>
                </div>
                <input
                  type="checkbox"
                  className="size-5 rounded border-gray-300 text-[#170A51] focus:ring-[#170A51] cursor-pointer"
                  {...form.register('isPublished')}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isPending || uploadingImage}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || uploadingImage}
                  className="bg-[#170A51] hover:bg-[#22203E] text-white text-xs font-semibold py-2 px-4 shadow-sm"
                >
                  {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
