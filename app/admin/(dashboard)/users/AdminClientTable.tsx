'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Edit2,
  Trash2,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  createAdmin,
  deleteAdmin,
  editAdmin,
  requestSuperAdminTransferOtp,
  confirmSuperAdminTransfer,
} from '@/app/actions/admin';

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
  createdAt: string | Date;
}

interface AdminClientTableProps {
  admins: AdminUser[];
  isSuperAdmin: boolean;
  currentAdminEmail: string;
}

export default function AdminClientTable({
  admins,
  isSuperAdmin,
  currentAdminEmail,
}: AdminClientTableProps) {
  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editAdminId, setEditAdminId] = useState<string | null>(null);

  // Transfer Role & OTP states
  const [transferTarget, setTransferTarget] = useState<AdminUser | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isConfirmingTransfer, setIsConfirmingTransfer] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes (300 seconds)
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const activeEditAdmin = admins.find((a) => a.id === editAdminId);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (!otpSent || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, countdown]);

  const handleOpenTransferModal = (admin: AdminUser) => {
    setTransferTarget(admin);
    setOtpSent(false);
    setOtpCode('');
    setTransferError(null);
    setTransferSuccess(null);
    setCountdown(300);
  };

  const handleCloseTransferModal = () => {
    setTransferTarget(null);
    setOtpSent(false);
    setOtpCode('');
    setTransferError(null);
    setTransferSuccess(null);
  };

  const handleRequestOtp = async () => {
    if (!transferTarget) return;
    setIsSendingOtp(true);
    setTransferError(null);
    try {
      const res = await requestSuperAdminTransferOtp(transferTarget.id);
      if (res.success) {
        setOtpSent(true);
        setCountdown(300);
      }
    } catch (err: any) {
      setTransferError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTarget || !otpCode.trim()) return;
    setIsConfirmingTransfer(true);
    setTransferError(null);
    try {
      const res = await confirmSuperAdminTransfer(transferTarget.id, otpCode);
      if (res.success) {
        setTransferSuccess(
          `Super Administrator privileges successfully transferred to ${transferTarget.name || transferTarget.email}. Refreshing portal...`
        );
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      setTransferError(err.message || 'Failed to verify code and transfer role.');
      setIsConfirmingTransfer(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 font-['Neue_Machina']">
      {/* Top Header & Invite Button */}
      {isSuperAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#170A51] hover:bg-[#22203E] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Administrator
            </DialogTrigger>
            <DialogContent showCloseButton>
              <DialogTitle className="text-xl font-['Anton'] text-[#106333]">
                Grant Access to New Admin
              </DialogTitle>
              <DialogDescription>
                Fill out the administrator's details below. An automated email invitation will be sent immediately.
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
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gmail / Google Account Address</label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]"
                    placeholder="admin@gmail.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#170A51] hover:bg-[#22203E] text-white px-6 py-2.5 rounded-lg font-medium transition-colors mt-2 cursor-pointer"
                >
                  Send Invitation
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Edit Modal (Only for standard ADMINs) */}
      <Dialog open={!!editAdminId} onOpenChange={(open) => !open && setEditAdminId(null)}>
        <DialogContent showCloseButton>
          <DialogTitle className="text-xl font-['Anton'] text-[#170A51]">
            Edit Administrator Details
          </DialogTitle>
          <DialogDescription>
            Update the contact details for this administrator.
          </DialogDescription>
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
              <input
                defaultValue={activeEditAdmin?.name || ''}
                required
                name="name"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gmail / Google Account Address</label>
              <input
                defaultValue={activeEditAdmin?.email || ''}
                required
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#C85B15] focus:border-[#C85B15]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#170A51] hover:bg-[#22203E] text-white px-6 py-2.5 rounded-lg font-medium transition-colors mt-2 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Transfer Role Confirmation Modal */}
      <Dialog open={!!transferTarget} onOpenChange={(open) => !open && handleCloseTransferModal()}>
        <DialogContent showCloseButton className="max-w-lg">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <KeyRound className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-['Anton'] text-[#170A51] tracking-wide">
                Transfer Super Administrator Privileges
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                Target User: <strong className="text-gray-900">{transferTarget?.name || transferTarget?.email}</strong> ({transferTarget?.email})
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Warning Callout */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                CRITICAL SECURITY NOTICE
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Super Administrator privileges are transferred as an atomic handoff. Once confirmed, <strong>{transferTarget?.name || transferTarget?.email}</strong> will become a Super Administrator, and <strong>your account will immediately become a standard Administrator</strong>.
              </p>
            </div>

            {transferError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {transferError}
              </div>
            )}

            {transferSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                {transferSuccess}
              </div>
            )}

            {!otpSent ? (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  To protect against accidental or unauthorized role elevation, a 6-digit confirmation code must be dispatched to your registered email address (<strong className="text-gray-900">{currentAdminEmail}</strong>).
                </p>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isSendingOtp}
                  className="w-full flex items-center justify-center gap-2 bg-[#170A51] hover:bg-[#22203E] disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <KeyRound className="size-4" />
                      Send Code
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmTransfer} className="space-y-4 pt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-1">
                  <p className="font-semibold">Code sent to: {currentAdminEmail}</p>
                  <p className="text-blue-700">
                    Code expires in: <span className="font-mono font-bold text-blue-900">{formatCountdown(countdown)}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Enter 6-Digit Confirmation OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-2xl font-mono tracking-[8px] font-bold py-2.5 border-2 border-gray-300 rounded-xl focus:border-[#C85B15] focus:ring-2 focus:ring-[#C85B15]/20 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isSendingOtp || countdown > 240}
                    className="text-[#170A51] hover:text-[#C85B15] font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`size-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    Resend Code {countdown > 240 ? `(${countdown - 240}s)` : ''}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isConfirmingTransfer || otpCode.length !== 6 || countdown <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#C85B15] hover:bg-[#a5490f] disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {isConfirmingTransfer ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Authorizing Role Transfer...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Confirm Role Transfer
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Administrators Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] divide-y divide-gray-200">
            <thead className="bg-gray-50/90 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Administrator
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  System Role
                </th>
                {isSuperAdmin && (
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Actions & Governance
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {admins.map((admin) => {
                const isThisAdminSuper = admin.role === 'SUPERADMIN';
                const isCurrentSelf = admin.email.toLowerCase() === currentAdminEmail.toLowerCase();

                return (
                  <tr
                    key={admin.id}
                    className={`transition-colors ${
                      isThisAdminSuper ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.06]' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    {/* Name */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isThisAdminSuper
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {admin.name || 'Unnamed Admin'}
                            {isCurrentSelf && (
                              <span className="ml-2 text-[10px] font-bold text-[#106333] bg-[#106333]/10 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap font-mono text-xs">
                      {admin.email}
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-4 text-sm whitespace-nowrap">
                      {isThisAdminSuper ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                          SUPERADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          ADMIN
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {isSuperAdmin && (
                      <td className="px-5 py-4 text-sm text-right whitespace-nowrap">
                        {isThisAdminSuper ? (
                          <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                            <ShieldAlert className="size-3.5 text-gray-400" />
                            <span>Protected Superadmin</span>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenTransferModal(admin)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Transfer Superadmin privileges to this admin"
                            >
                              <ShieldCheck className="size-3.5 text-amber-600" />
                              <span>Make Superadmin</span>
                            </button>

                            {/* Edit Admin */}
                            <button
                              type="button"
                              onClick={() => setEditAdminId(admin.id)}
                              className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer"
                              title="Edit Admin"
                            >
                              <Edit2 className="size-4" />
                            </button>

                            {/* Delete Admin */}
                            <button
                              type="button"
                              onClick={async () => {
                                if (
                                  confirm(
                                    `Are you sure you want to revoke access for ${admin.name || admin.email}?`
                                  )
                                ) {
                                  await deleteAdmin(admin.id);
                                  window.location.reload();
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Revoke Administrator Access"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}