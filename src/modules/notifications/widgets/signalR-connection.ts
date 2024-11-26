/* eslint-disable no-console */
import * as signalR from '@microsoft/signalr';

const URL = 'https://headnshoulder.hanhtester.xyz/statusHub';
class Connector {
  public connection: signalR.HubConnection;

  public notificationEvents: (onMessageReceived: (userId: string) => void) => void;

  // eslint-disable-next-line no-use-before-define
  static instance: Connector;

  constructor(accessToken: string, userId: string) {
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
        this.joinGroup(userId);

        this.connection.onreconnected(() => this.joinGroup(userId));
        this.connection.onreconnecting((err) => console.warn('Reconnecting...', err));
      })
      .catch((err) => document.write(err));

    this.notificationEvents = (onMessageReceived) => {
      this.connection.on('NotificationResponse', (response) => {
        console.log('Event received');
        console.log(response);
        onMessageReceived(response);
      });
    };
  }

  private joinGroup(userId: string) {
    try {
      this.connection.invoke('JoinGroup', userId);
      console.log(`Joined group ${userId}`);
    } catch (err: any) {
      console.error('Error joining group:', err.toString());
    }
  }

  public static getInstance(accessToken: string, userId: string): Connector {
    if (!Connector.instance) Connector.instance = new Connector(accessToken, userId);
    return Connector.instance;
  }
}
export default Connector.getInstance;
