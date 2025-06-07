import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUserStore } from "@/stores/useUserStore";
import { User } from "@/utils/types";
import LoadingSpinner from "@/components/ui/loading";
import { Save } from "lucide-react";

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: User) => void;
}

const AddUserDialog = ({
  isOpen,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) => {
  const { isLoading, createUser } = useUserStore();

  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    password: "",
    email: "",
    role: "",
    status: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    role: "",
    status: "",
});

  const createUserData = (field: keyof typeof userData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    setErrors({
      email: "",
      username: "",
      fullName: "",
      password: "",
      role: "",
      status: "",
    });

    let hasError = false;
    const newErrors = {
      email: "",
      username: "",
      fullName: "",
      password: "",
      role: "",
      status: "",
    };

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!userData.username.trim()) {
      newErrors.username = "Username is required";
      hasError = true;
    }
    if (!userData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      hasError = true;
    }
    if (!userData.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }
    if (!userData.role) {
      newErrors.role = "Role is required";
      hasError = true;
    }
    if (!userData.status) {
      newErrors.status = "Status is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("username", userData.username);
    formData.append("fullName", userData.fullName);
    formData.append("password", userData.password);
    formData.append("role", userData.role);
    formData.append("status", userData.status);

    const user = await createUser(formData);

    if (user) {
      onUserAdded(user);

      setUserData({
        username: "",
        fullName: "",
        password: "",
        email: "",
        role: "",
        status: "",
      });

      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-[#121212]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>

          <DialogDescription>
            Create a new user account in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={userData?.email}
              onChange={(e) => createUserData("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="Enter username"
              value={userData?.username}
              onChange={(e) => createUserData("username", e.target.value)}
            />
            {errors.username && (
              <span className="text-sm text-red-500">{errors.username}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="fullName"
              placeholder="Enter full name"
              value={userData?.fullName}
              onChange={(e) => createUserData("fullName", e.target.value)}
            />
            {errors.fullName && (
              <span className="text-sm text-red-500">{errors.fullName}</span>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={userData?.password}
                onChange={(e) => createUserData("password", e.target.value)}
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            <Label htmlFor="role">Role</Label>
            <Select
              value={userData?.role}
              onValueChange={(value) => createUserData("role", value)}
            >
              <SelectTrigger id="role" className="cursor-pointer">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="user"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  User
                </SelectItem>
                <SelectItem
                  value="artist"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Artist
                </SelectItem>
                <SelectItem
                  value="admin"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <span className="text-sm text-red-500">{errors.role}</span>
            )}
            
            <Label htmlFor="status">Status</Label>
            <Select
              value={userData?.status}
              onValueChange={(value) => createUserData("status", value)}
            >
              <SelectTrigger id="status" className="cursor-pointer">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="active"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="pending"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="lock"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  Lock
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <span className="text-sm text-red-500">{errors.role}</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setUserData({
                username: "",
                fullName: "",
                password: "",
                email: "",
                role: "",
                status: "",
              });

              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateUser}
            className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
