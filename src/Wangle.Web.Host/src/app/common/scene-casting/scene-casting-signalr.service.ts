import { Injectable, Injector, NgZone } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { AppComponentBase } from '@shared/app-component-base';

@Injectable()
export class SceneCastingSignalrService extends AppComponentBase {

    constructor(
        injector: Injector,
        public _zone: NgZone
    ) {
        super(injector);
    }

    castingHub: HubConnection;
    private _isConnected = false;
    public get isConnected(): boolean {
        return this._isConnected;
    }

    private _lastCasting = undefined;
    public get lastCasting(): string {
        return this._lastCasting;
    }
    public set lastCasting(value: string) {
        this._lastCasting = value;
    }
    isCastingActive = false;

    configureConnection(connection): void {
        // Set the common hub
        this.castingHub = connection;

        // Reconnect if hub disconnects
        connection.onclose(e => {
            this._isConnected = false;
            if (e) {
                abp.log.debug('Casting connection closed with error: ' + e);
            } else {
                abp.log.debug('Casting disconnected');
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
        this.registerEvents(connection);
    }

    registerEvents(connection): void {
        connection.on('receiveCasting', casting => {
            this.lastCasting = casting;
        });

        connection.on('castingChecked', isCasting => {
            this.isCastingActive = isCasting;
        });

        connection.on('groupNotice', message => {
            abp.event.trigger('app.sceneCast.groupNotification', message);
        });

        abp.event.on('app.sceneCast.groupNotification', function(message) {
            abp.notify.info(`${message}`);
        });
    }

    sendCasting(castingJson, groupName, callback): void {
        if (!this.isConnected) {
            if (callback) {
                callback();
            }

            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.castingHub.invoke('castToGroup', castingJson, groupName).then(() => {

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

    setIsCasting(isCasting, groupName, callback): void {
        if (!this.isConnected) {
            if (callback) {
                callback();
            }

            abp.notify.warn(this.l('ChatIsNotConnectedWarning'));
            return;
        }

        this.castingHub.invoke('setIsCasting', isCasting, groupName).then(() => {

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

        this.castingHub.invoke('addToGroup', groupName, username).then(() => {

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

        this.castingHub.invoke('removeFromGroup', groupName, username).then(() => {

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
            abp.signalr.startConnection(abp.appPath + 'signalr-sceneCastingHub', connection => {
                abp.event.trigger('app.sceneCast.connected');
                this._isConnected = true;
                this.configureConnection(connection);
            });
        });
    }
}
