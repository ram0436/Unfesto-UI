export class EventPayload {
  // Metadata
  createdBy: number = 1;
  createdOn: string = new Date().toISOString();
  modifiedBy: number = 1;
  modifiedOn: string = new Date().toISOString();
  id: number = 0;

  // Event Details
  eventLogoURL: string = "";
  eventTypeId: number = 0;
  visibilityId: number = 0;
  title: string = "";
  organisationId: number = 0;
  websiteURL: string = "";
  eventModeId: number = 0;
  description: string = "";

  // Categories and Skills
  categoryList: { id: number; name: string }[] = [{ id: 0, name: "" }];
  skillList: { id: number; name: string }[] = [{ id: 0, name: "" }];
}
