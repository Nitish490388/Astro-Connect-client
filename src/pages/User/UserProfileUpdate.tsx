import UserProfileForm from "@/components/userProfileForm";

const UserProfileUpdate = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 flex flex-col items-center">
      {/* Page Header */}
      <div className="max-w-2xl w-full text-center space-y-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Update Your Profile
        </h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          Keep your personal information up to date to get the best personalized
          experience. You can update your date of birth, gender, birth details, and
          more. Your email address remains fixed for account security.
        </p>
      </div>

      {/* Profile Update Form */}
      <div className="w-full max-w-2xl">
        <UserProfileForm />
      </div>
    </div>
  );
};

export default UserProfileUpdate;
