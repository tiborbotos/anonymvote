import {Component} from '@angular/core';
import {GunDb, PollOptions, Participant, Poll} from './db.service';

enum AppMode {
    OPEN_POLL,
    CREATOR,
    LOGIN
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    pollId = 'p1j3uh';
    errorMessage = '';
    currentUser: Participant;
    pollOptions: PollOptions;

    private mode = AppMode.OPEN_POLL;
    private poll: Poll = null;

    constructor(private gunDb: GunDb) {
        this.currentUser = {
            name: 'Anonym User ' + Math.ceil(Math.random() * 100 + 10),
            id: Math.random() * 10000000
        };
    }

    isCurrentModeOpenPoll() {
        return this.mode === AppMode.OPEN_POLL;
    }

    isCurrentModeCreator() {
        return this.mode === AppMode.CREATOR;
    }

    isValidRoom() {
        return this.pollId.match('^[a-z,A-Z,0-9]{6,6}$');
    }

    isPollLoaded() {
        return this.poll !== null;
    }

    // creates a new poll instance
    createPoll() {
        this.gunDb.createPoll(this.currentUser)
            .then(this.enterPoll.bind(this))
            .catch(() => {
                this.errorMessage = 'An error occurred and we couldn\'t create this poll';
            });
    }

    // connects to an existing poll
    openPoll() {
        this.gunDb.openPoll(this.pollId, this.currentUser)
            .then(this.enterPoll.bind(this))
            .catch(() => {
                this.errorMessage = 'An error occured and we couldn\'t connect to this poll';
            });
    }

    private enterPoll(poll) {
        this.mode = AppMode.CREATOR;
        this.poll = poll;
        this.pollOptions = this.poll.options;
    }
}
