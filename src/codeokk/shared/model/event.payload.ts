export class EventPayload {
  // Metadata
  createdBy: number = 0;
  createdOn: string = new Date().toISOString();
  modifiedBy: number = 0;
  modifiedOn: string = new Date().toISOString();
  id: number = 0;

  // Event Details
  tabRefGuid: string = "";
  eventLogoURL: string = "";
  eventBannerURL: string = "";
  thumbnailURL: string = "";
  eventTypeId: number = 0;
  visibilityId: number = 0;
  title: string = "";
  parentTitle: string = "";
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
    minTeamMember: number;
    maxTeamMember: number;
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
      minTeamMember: 0,
      maxTeamMember: 0,
      registartionStartDateTime: new Date().toISOString(),
      registartionEndDateTime: new Date().toISOString(),
      registrationCountLimit: 0,
    },
  ];

  // Categories and Skills
  eventCategoryList: { id: number; name: string }[] = [{ id: 0, name: "" }];
  eventSkillList: { id: number; name: string }[] = [{ id: 0, name: "" }];

  // Collaborators
  eventCollaboratorList: {
    createdBy: number;
    createdOn: string;
    modifiedBy: number;
    modifiedOn: string;
    id: number;
    userId: string;
  }[] = [
    {
      createdBy: 0,
      createdOn: new Date().toISOString(),
      modifiedBy: 0,
      modifiedOn: new Date().toISOString(),
      id: 0,
      userId: "",
    },
  ];

  // Rounds
  eventRoundList: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }[] = [
    {
      id: 0,
      title: "",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  ];

  // Contacts
  eventContactList: {
    id: number;
    name: string;
    email: string;
    contactNo: string;
  }[] = [
    {
      id: 0,
      name: "",
      email: "",
      contactNo: "",
    },
  ];

  // Prizes
  eventPrizeList: {
    id: number;
    title: string;
    isParticipationCertificateProvided: boolean;
    prizeList: {
      id: number;
      rank: string;
      cash: number;
      perks: string;
      otherDetails: string;
    }[];
  }[] = [
    {
      id: 0,
      title: "",
      isParticipationCertificateProvided: true,
      prizeList: [
        {
          id: 0,
          rank: "",
          cash: 0,
          perks: "",
          otherDetails: "",
        },
      ],
    },
  ];

  // Participant Eligibility
  eventParticipantEligibilityList: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    gender: string;
    organizationId: number;
    userTypeId: number;
    courseId: number;
    experience: number;
  }[] = [
    {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      gender: "",
      organizationId: 0,
      userTypeId: 0,
      courseId: 0,
      experience: 0,
    },
  ];

  // Gallery
  eventGalleryList: {
    id: number;
    imageURL: string;
    description: string;
  }[] = [
    {
      id: 0,
      imageURL: "",
      description: "",
    },
  ];
}
