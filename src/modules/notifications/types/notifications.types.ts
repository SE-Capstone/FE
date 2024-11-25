export enum NotificationTypeEnum {
  assignMember = 'assignMember',
  assignLeader = 'assignLeader',
  assignIssue = 'assignIssue',
  updateIssue = 'updateIssue',
  createComment = 'createComment',
  updateComment = 'updateComment',
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
    assignerName: string;
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
  [NotificationTypeEnum.createComment]: {
    type: NotificationTypeEnum.createComment;
    issueId: string;
    commentId: string;
    issueName: string;
    issueIndex: number;
    issueStatusName: string;
    commenterName: string;
    commenterUsername: string;
    commenterAvatar?: string;
  };
  [NotificationTypeEnum.updateComment]: {
    type: NotificationTypeEnum.updateComment;
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

export type AssignMemberData = NotificationDataMap[NotificationTypeEnum.assignMember];

export type AssignLeaderData = NotificationDataMap[NotificationTypeEnum.assignLeader];

export type AssignIssueData = NotificationDataMap[NotificationTypeEnum.assignIssue];

export type UpdateIssueData = NotificationDataMap[NotificationTypeEnum.updateIssue];

export type CreateCommentData = NotificationDataMap[NotificationTypeEnum.createComment];

export type UpdateCommentData = NotificationDataMap[NotificationTypeEnum.updateComment];

export type INotification = {
  id: string;
  userId: string;
  type: NotificationTypeEnum;
  data:
    | AssignMemberData
    | AssignLeaderData
    | AssignIssueData
    | UpdateIssueData
    | CreateCommentData
    | UpdateCommentData;
  hasRead: boolean;
  createdAt: Date | string;
};
