/* eslint-disable no-console */
import * as signalR from '@microsoft/signalr';

const URL = 'https://headnshoulder.hanhtester.xyz/statusHub';
class Connector {
  public connection: signalR.HubConnection;

  public events: (onMessageReceived: (userId: string) => void) => void;

  // eslint-disable-next-line no-use-before-define
  static instance: Connector;

  constructor(accessToken: string, projectId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');

        // Tham gia vào group với ID cụ thể
        this.connection
          .invoke('JoinGroup', projectId)
          .then(() => console.log(`Joined group ${projectId}`))
          .catch((err) => console.error(err.toString()));
      })
      .catch((err) => document.write(err));

    this.events = (onMessageReceived) => {
      this.connection.on('StatusOrderResponse', (response) => {
        console.log('Event received');
        console.log(response);
        onMessageReceived(response);
      });
    };
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
