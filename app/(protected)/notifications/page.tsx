"use client";

import { useNotifications } from "@/api/queries/getNotifications.query";
import { useAcceptInvite } from "@/api/mutations/acceptInvite.mutation";

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications();
  const acceptInvite = useAcceptInvite();

  const notifications = data?.data || [];

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-[#1F2937] mb-4">
          Notifications
        </h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-[#1F2937] mb-4">
          Notifications
        </h1>
        <p className="text-red-500">Failed to load notifications</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-semibold text-[#1F2937]">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="p-6 bg-white border border-[#D1D5DB] rounded-lg text-gray-500">
          No notifications
        </div>
      ) : (
        notifications.map((notif: any) => {
          const inviteToken = notif?.data?.inviteToken;
          const isProjectInvite = !!inviteToken;

          return (
            <div
              key={notif._id}
              className="bg-white border border-[#D1D5DB] p-4 rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <h3 className="font-semibold text-[#1F2937]">{notif.title}</h3>

              <p className="text-sm text-gray-600 mt-1">{notif.body}</p>

              {/* Accept Invite Button (Only for project invitations) */}
              {isProjectInvite && (
                <button
                  onClick={() => acceptInvite.mutate(inviteToken)}
                  disabled={acceptInvite.isPending}
                  className="mt-3 px-3 py-2 bg-[#1F2937] text-white rounded-lg hover:bg-[#111827] disabled:opacity-50 transition-colors"
                >
                  {acceptInvite.isPending ? "Accepting..." : "Accept Invite"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
