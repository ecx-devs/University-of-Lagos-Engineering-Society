"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Edit2, Trash2, Plus } from "lucide-react";
import { createAdmin, deleteAdmin, editAdmin } from "@/app/actions/admin";

export default function AdminClientTable({ admins, isSuperAdmin, superAdminEmail }: { admins: any[], isSuperAdmin: boolean, superAdminEmail: string | undefined }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editAdminId, setEditAdminId] = useState<string | null>(null);

  const activeEditAdmin = admins.find(a => a.id === editAdminId);

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      {isSuperAdmin && (
        <div className="flex justify-end">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger className="flex items-center gap-2 bg-[#170A51] hover:bg-[#22203E] text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Add New Administrator
            </DialogTrigger>
            <DialogContent showCloseButton>
              <DialogTitle className="text-xl font-['Anton'] text-[#106333]">Grant Access to New Admin</DialogTitle>
              <DialogDescription>
                Fill out the details below. An email invitation will be automatically sent.
              </DialogDescription>
              <form 
                action={async (formData) => {
                  await createAdmin(formData);
                  setCreateOpen(false);
                  window.location.reload();
                }} 
                className="space-y-4 mt-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required name="name" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Address</label>
                  <input required name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]" placeholder="admin@gmail.com" />
                </div>
                <button type="submit" className="w-full bg-[#170A51] hover:bg-[#22203E] text-white px-6 py-2.5 rounded-lg font-medium transition-colors mt-2">
                  Send Invitation
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editAdminId} onOpenChange={(open) => !open && setEditAdminId(null)}>
        <DialogContent showCloseButton>
          <DialogTitle className="text-xl font-['Anton'] text-[#170A51]">Edit Administrator</DialogTitle>
          <DialogDescription>Update the details of the selected administrator.</DialogDescription>
          <form 
            action={async (formData) => {
              if (editAdminId) {
                await editAdmin(editAdminId, formData);
                setEditAdminId(null);
                window.location.reload();
              }
            }} 
            className="space-y-4 mt-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input defaultValue={activeEditAdmin?.name} required name="name" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Address</label>
              <input defaultValue={activeEditAdmin?.email} required name="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]" />
            </div>
            <button type="submit" className="w-full bg-[#170A51] hover:bg-[#22203E] text-white px-6 py-2.5 rounded-lg font-medium transition-colors mt-2">
              Save Changes
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              {isSuperAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-[#106333]/5">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">System Superadmin</td>
              <td className="px-6 py-4 text-sm text-gray-500">{superAdminEmail}</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#106333] text-white">SUPERADMIN</span>
              </td>
              {isSuperAdmin && <td className="px-6 py-4 text-sm text-right text-gray-400">Fixed System Role</td>}
            </tr>
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{admin.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{admin.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">ADMIN</span>
                </td>
                {isSuperAdmin && (
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditAdminId(admin.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Admin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to revoke this admin's access?")) {
                            await deleteAdmin(admin.id);
                            window.location.reload();
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}