'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createOrUpdateSpotlight, toggleSpotlightPublished, getSpotlights, deleteSpotlight } from '@/app/actions/spotlight';
import { uploadToCloudinary } from '@/app/actions/upload';
import { compressImageFile } from '@/lib/image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Trash2, UploadCloud, X, Loader2, Edit, Star } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['volunteer', 'lecturer']),
  monthYear: z.string().min(1, 'Month/Year is required'),
  name: z.string().min(1, 'Name is required'),
  departmentOrRole: z.string().min(1, 'Department/Role is required'),
  story: z.string().min(10, 'Story is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  isPublished: z.boolean(),
});

type SpotlightType = 'volunteer' | 'lecturer';

const INITIAL_FORM_VALUES = {
  id: undefined,
  type: 'volunteer' as SpotlightType,
  monthYear: '',
  name: '',
  departmentOrRole: '',
  story: '',
  imageUrl: '',
  isPublished: false,
};

export default function SpotlightsAdminPage() {
  const [spotlights, setSpotlights] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  useEffect(() => {
    loadSpotlights();
  }, []);

  const loadSpotlights = async () => {
    const data = await getSpotlights();
    setSpotlights(data);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset(INITIAL_FORM_VALUES);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const payload = editingId ? { ...values, id: editingId } : { ...values, id: undefined };
      await createOrUpdateSpotlight(payload);
      handleCancelEdit();
      loadSpotlights();
    });
  };

  const handleEdit = (spotlight: any) => {
    setEditingId(spotlight.id);
    form.reset({
      id: spotlight.id,
      type: spotlight.type as SpotlightType,
      monthYear: spotlight.monthYear,
      name: spotlight.name,
      departmentOrRole: spotlight.departmentOrRole,
      story: spotlight.story,
      imageUrl: spotlight.imageUrl,
      isPublished: spotlight.isPublished,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this spotlight?")) {
      startTransition(async () => {
        await deleteSpotlight(id);
        loadSpotlights();
      });
    }
  };

  const handleTogglePublish = (id: string, isPublished: boolean) => {
    startTransition(async () => {
      await toggleSpotlightPublished(id, !isPublished);
      loadSpotlights();
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      const base64 = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.82 });
      const secureUrl = await uploadToCloudinary(base64);
      form.setValue('imageUrl', secureUrl, { shouldValidate: true });
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const imageUrl = form.watch('imageUrl');

  return (
    <div className="container mx-auto py-4 px-2 max-w-7xl">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 text-[#22203E] pb-2 border-b">
            {editingId ? 'Edit Spotlight' : 'Create New Spotlight'}
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Type</label>
              <Select
                onValueChange={(val) => form.setValue('type', val as SpotlightType)}
                value={form.watch('type')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Month / Year</label>
              <Input placeholder="e.g. October 2026" {...form.register('monthYear')} />
              {form.formState.errors.monthYear && <p className="text-red-500 text-xs mt-1">{form.formState.errors.monthYear.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Name</label>
              <Input placeholder="Full Name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Department / Role</label>
              <Input placeholder="e.g. Software Engineering" {...form.register('departmentOrRole')} />
              {form.formState.errors.departmentOrRole && <p className="text-red-500 text-xs mt-1">{form.formState.errors.departmentOrRole.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Profile Image</label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              
              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <Image src={imageUrl} alt="Uploaded preview" fill className="object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100"
                      onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-4 h-4 mr-2" /> Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer
                    ${uploadingImage ? 'border-gray-300 bg-gray-50' : 'border-[#185A48]/30 hover:border-[#185A48] bg-[#185A48]/5 hover:bg-[#185A48]/10'}
                  `}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mb-2" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-[#185A48]">
                      <UploadCloud className="w-8 h-8 mb-2 opacity-80" />
                      <span className="text-sm font-medium">Click to upload image</span>
                    </div>
                  )}
                </div>
              )}
              {form.formState.errors.imageUrl && <p className="text-red-500 text-xs mt-1">{form.formState.errors.imageUrl.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Story / Description</label>
              <Textarea placeholder="Write their exceptional story here..." className="min-h-[150px] resize-y" {...form.register('story')} />
              {form.formState.errors.story && <p className="text-red-500 text-xs mt-1">{form.formState.errors.story.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isPending || uploadingImage} className="w-full bg-[#185A48] hover:bg-[#124134] text-white">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? 'Update Spotlight' : 'Create Spotlight'}
              </Button>
              
              {editingId && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleCancelEdit} 
                  className="w-full mt-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-[#22203E] pb-2 border-b">Historical Spotlights</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Month</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spotlights.map((s) => (
                  <TableRow key={s.id} className="group">
                    <TableCell className="capitalize font-medium text-gray-700">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${s.type === 'volunteer' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {s.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{s.monthYear}</TableCell>
                    <TableCell className="font-medium text-[#22203E]">{s.name}</TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleTogglePublish(s.id, s.isPublished)}
                        disabled={isPending}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                          s.isPublished 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {s.isPublished ? 'Live' : 'Draft'}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(s)} title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(s.id)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {spotlights.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Star className="w-8 h-8 text-gray-300 mb-2" />
                        <p>No spotlights found. Create one to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}
