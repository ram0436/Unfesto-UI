export class UserPayload {
  // Metadata
  createdBy: number = 0;
  createdOn: string = new Date().toISOString();
  modifiedBy: number = 0;
  modifiedOn: string = new Date().toISOString();
  id: number = 0;

  // User Details
  firstName: string = "";
  lastName: string = "";
  profilePicURL: string = "";
  userId: string = "";
  password: string = "";
  email: string = "";
  mobileNo: string = "";
  gender: string = "";

  // User Attributes
  userTypeId: number = 0;
  courseId: number = 0;
  collegeId: number = 0;
  purposeId: number = 0;
  userRoleId: number = 0;

  // Location Details
  pincode: string = "";
  city: string = "";
  state: string = "";
}
