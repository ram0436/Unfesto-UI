export class EventPayload {
  // Metadata
  createdBy: number = 0;
  createdOn: string = new Date().toISOString();
  modifiedBy: number = 0;
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

  eventRegistrationList: {
    createdBy: number;
    createdOn: string;
    modifiedBy: number;
    modifiedOn: string;
    id: number;
    participationTypeId: number;
    registartionStartDateTime: string;
    registartionEndDateTime: string;
    registrationCountLimit: number;
  }[] = [
    {
      createdBy: 0,
      createdOn: new Date().toISOString(),
      modifiedBy: 0,
      modifiedOn: new Date().toISOString(),
      id: 0,
      participationTypeId: 0,
      registartionStartDateTime: new Date().toISOString(),
      registartionEndDateTime: new Date().toISOString(),
      registrationCountLimit: 0,
    },
  ];

  // Categories and Skills
  categoryList: { id: number; name: string }[] = [{ id: 0, name: "" }];
  skillList: { id: number; name: string }[] = [{ id: 0, name: "" }];

  eventCollaboratorList: {
    createdBy: number;
    createdOn: string;
    modifiedBy: number;
    modifiedOn: string;
    id: number;
    userId: number;
  }[] = [
    {
      createdBy: 0,
      createdOn: new Date().toISOString(),
      modifiedBy: 0,
      modifiedOn: new Date().toISOString(),
      id: 0,
      userId: 0,
    },
  ];
}
