import { Injectable, Injector, NgZone } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { AppComponentBase } from '@shared/app-component-base';

const MESSAGE_LIMIT = 5;

export class ChatMessageDto {
    username: string;
    message: string;
    timestamp: string;

    constructor (username: string, message: string, timestamp: string) {
        this.username = username;
        this.message = message;
        this.timestamp = timestamp;
    }
  }

@Injectable()
export class ChatSignalrService extends AppComponentBase {

    constructor(
        injector: Injector,
        public _zone: NgZone
    ) {
        super(injector);
    }

    chatHub: HubConnection;
    private _isConnected = false;
    public get isConnected(): boolean {
        return this._isConnected;
    }

    private _messages: ChatMessageDto[] = [];
    public get messages(): ChatMessageDto[] {
        if (this._messages) {
            this._messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return this._messages.slice(0, MESSAGE_LIMIT);
        }
        
        return [];
    }

    configureConnection(connection): void {
        // Set the common hub
        this.chatHub = connection;

        // Reconnect if hub disconnects
        connection.onclose(e => {
            this._isConnected = false;
            if (e) {
                abp.log.debug('Chat connection closed with error: ' + e);
            } else {
                abp.log.debug('Chat disconnected');
            }

            if (!abp.signalr.autoConnect) {
                return;
            }

            setTimeout(() => {
                connection.start().then(result => {
                    this._isConnected = true;
                });
            }, 5000);
        });

        // Register to get notifications
        this.registerChatEvents(connection);
    }

    registerChatEvents(connection): void {
        connection.on('receiveMessage', messageData => {
            const payload = JSON.parse(messageData);
            const message = new ChatMessageDto(payload.Username, payload.Message, payload.Timestamp);
            this._messages.push(message);
        });

        // abp.event.on('app.chat.messageReceived', function(message) {
        //     abp.notify.success(`${message}`);
        // });
        //
        // connection.on('groupNotice', message => {
        //     abp.event.trigger('app.chat.groupNotification', message);
        // });
        //
        // abp.event.on('app.chat.groupNotification', function(message) {
        //     abp.notify.info(`${message}`);
        // });
    }

    sendMessage(message, groupName, username, callback): void {
        if (!this.isConnected) {
            if (callback) {
                callback();
            }

            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.chatHub.invoke('sendGroupMessage', message, groupName, username).then(() => {

            if (callback) {
                callback();
            }
        }).catch(error => {
            abp.log.error(error);

            if (callback) {
                callback();
            }
        });
    }

    joinGroup(groupName, username, callback): void {
        if (!this.isConnected) {
            if (callback) {
                callback();
            }

            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.chatHub.invoke('addToGroup', groupName, username).then(() => {

            if (callback) {
                callback();
            }
        }).catch(error => {
            abp.log.error(error);

            if (callback) {
                callback();
            }
        });
    }

    leaveGroup(groupName, username, callback): void {
        if (!this.isConnected) {
            if (callback) {
                callback();
            }

            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.chatHub.invoke('removeFromGroup', groupName, username).then(() => {

            if (callback) {
                callback();
            }
        }).catch(error => {
            abp.log.error(error);

            if (callback) {
                callback();
            }
        });
    }

    init(): void {
        this._zone.runOutsideAngular(() => {
            abp.signalr.connect();
            abp.signalr.startConnection(abp.appPath + 'signalr-chatHub', connection => {
                abp.event.trigger('app.chat.connected');
                this._isConnected = true;
                this.configureConnection(connection);
            });
        });
    }
}
