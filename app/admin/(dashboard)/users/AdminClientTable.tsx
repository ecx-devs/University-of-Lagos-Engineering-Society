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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#170A51] hover:bg-[#22203E] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" />
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[640px] divide-y divide-gray-200">
            <thead className="bg-gray-50/90 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Role</th>
                {isSuperAdmin && <th className="px-4 py-3 sm:px-6 sm:py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <tr className="bg-[#106333]/5">
                <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">System Superadmin</td>
                <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm text-gray-500 whitespace-nowrap">{superAdminEmail}</td>
                <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#106333] text-white tracking-wider">SUPERADMIN</span>
                </td>
                {isSuperAdmin && <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm text-right text-gray-400 whitespace-nowrap">Fixed System Role</td>}
              </tr>
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{admin.name}</td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm text-gray-500 whitespace-nowrap">{admin.email}</td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">ADMIN</span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-sm text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => setEditAdminId(admin.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
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
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
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
    </div>
  );
}