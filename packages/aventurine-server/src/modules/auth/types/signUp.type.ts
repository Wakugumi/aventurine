import { StringNullableChain } from "lodash";
import { Store } from "src/modules/core/store/store.entity"
import { User } from "src/modules/core/user/user.entity";

export type SignUpBaseParams = {
  store: Store
}

export type SignUpNewUserPayload = {
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  isEmailAlreadyVerified?: boolean;
}

export type SignUpNewStorePayload = {
  label: string;
  displayName?: string | null;
  logo?: string | null;
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}


export type PartialUserWithAvatar = {
  avatar?: string | null;
} & Partial<User>;


