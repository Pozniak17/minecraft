import { http } from './http';
import type {
  UserProfile,
  UserProfileUpdate,
  AuthenticatedChangePasswordInput,
} from './types';

export async function getProfile() {
  const { data } = await http.get<UserProfile>('/user/profile');
  return data;
}

export async function updateProfile(input: UserProfileUpdate) {
  const { data } = await http.patch<UserProfileUpdate>('/user/profile/update', input);
  return data;
}

export async function changeAccountPassword(input: AuthenticatedChangePasswordInput) {
  const { data } = await http.post('/user/profile/change-password', input);
  return data;
}

export async function uploadPhoto(file: File) {
  const form = new FormData();
  form.append('profile_photo', file);
  const { data } = await http.post('/user/profile/photo', form);
  return data;
}

export async function deletePhoto() {
  const { data } = await http.delete('/user/profile/photo');
  return data;
}
