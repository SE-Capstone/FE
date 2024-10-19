/* eslint-disable no-console */
import * as signalR from '@microsoft/signalr';

const URL = 'https://headnshoulder.hanhtester.xyz/statusHub';
class Connector {
  public connection: signalR.HubConnection;

  public orderStatusEvents: (onMessageReceived: (userId: string) => void) => void;

  // eslint-disable-next-line no-use-before-define
  static instance: Connector;

  constructor(accessToken: string, projectId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');

        // Tham gia vào group với ID cụ thể
        this.joinGroup(projectId);

        this.connection.onreconnected(() => this.joinGroup(projectId));
        this.connection.onreconnecting((err) => console.warn('Reconnecting...', err));
      })
      .catch((err) => document.write(err));

    this.orderStatusEvents = (onMessageReceived) => {
      this.connection.on('StatusOrderResponse', (response) => {
        console.log('Event received');
        console.log(response);
        onMessageReceived(response);
      });
    };
  }

  private joinGroup(projectId: string) {
    try {
      this.connection.invoke('JoinGroup', projectId);
      console.log(`Joined group ${projectId}`);
    } catch (err: any) {
      console.error('Error joining group:', err.toString());
    }
  }

  public sendMessage = ({
    projectId,
    statusId,
    position,
  }: {
    projectId: string;
    statusId: string;
    position: number;
  }) => {
    console.log('Start send message with body', {
      projectId,
      statusId,
      position,
    });
    this.connection
      .invoke('StatusOrderRequest', projectId, statusId, position)
      .then(() => console.log('Notification sent'))
      .catch((err) => console.error(err.toString()));
  };

  public static getInstance(accessToken: string, projectId: string): Connector {
    if (!Connector.instance) Connector.instance = new Connector(accessToken, projectId);
    return Connector.instance;
  }
}
export default Connector.getInstance;
