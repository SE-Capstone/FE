/* eslint-disable no-console */
import * as signalR from '@microsoft/signalr';

const URL = 'https://headnshoulder.hanhtester.xyz/notificationHub';
class Connector {
  public connection: signalR.HubConnection;

  public notificationEvents: (onMessageReceived: (userId: string) => void) => void;

  // eslint-disable-next-line no-use-before-define
  static instance: Connector;

  constructor(userId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL, {
        // eslint-disable-next-line no-bitwise
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
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

  public disconnect() {
    if (this.connection) {
      this.connection
        .stop()
        .then(() => {
          console.log('Disconnected from SignalR Hub');
        })
        .catch((err) => {
          console.error('Error disconnecting from SignalR Hub', err);
        });
    }
  }

  public static getInstance(userId: string): Connector {
    if (!Connector.instance) Connector.instance = new Connector(userId);
    return Connector.instance;
  }
}
export default Connector.getInstance;
