export enum NotificationTypeEnum {
  assignMember = 'assignMember',
  assignLeader = 'assignLeader',
  assignIssue = 'assignIssue',
  updateIssue = 'updateIssue',
  upsertComment = 'upsertComment',
}

// Define specific types for each notification type's data object
type NotificationDataMap = {
  [NotificationTypeEnum.assignMember]: {
    type: NotificationTypeEnum.assignMember;
    projectName: string;
    projectId: string;
    assignerName: string;
    assignerUsername: string;
    assignerAvatar?: string;
  };
  [NotificationTypeEnum.assignLeader]: {
    type: NotificationTypeEnum.assignLeader;
    projectName: string;
    projectId: string;
    assignerName: string;
    assignerUsername: string;
    assignerAvatar?: string;
  };
  [NotificationTypeEnum.assignIssue]: {
    type: NotificationTypeEnum.assignIssue;
    assignerFullName: string;
    assignerUsername: string;
    assignerAvatar?: string;
    issueName: string;
    issueId: string;
    issueIndex: number;
    issueStatusName: string;
  };
  [NotificationTypeEnum.updateIssue]: {
    type: NotificationTypeEnum.updateIssue;
    issueId: string;
    issueName: string;
    issueIndex: number;
    issueStatusName: string;
    updaterName: string;
    updaterUsername: string;
    updaterAvatar?: string;
  };
  [NotificationTypeEnum.upsertComment]: {
    type: NotificationTypeEnum.upsertComment;
    issueId: string;
    commentId: string;
    issueName: string;
    issueIndex: number;
    issueStatusName: string;
    commenterName: string;
    commenterUsername: string;
    commenterAvatar?: string;
  };
};

type AssignMemberData = NotificationDataMap[NotificationTypeEnum.assignMember];

type AssignLeaderData = NotificationDataMap[NotificationTypeEnum.assignLeader];

type AssignIssueData = NotificationDataMap[NotificationTypeEnum.assignIssue];

type UpdateIssueData = NotificationDataMap[NotificationTypeEnum.updateIssue];

type UpsertCommentData = NotificationDataMap[NotificationTypeEnum.upsertComment];

export type INotification = {
  id: string;
  userId: string;
  type: NotificationTypeEnum;
  data: AssignMemberData | AssignLeaderData | AssignIssueData | UpdateIssueData | UpsertCommentData;
  hasRead: boolean;
  createdAt: Date | string;
};
