import PollHandler from './pollHandler';
import JsonFetcher from '../jsonFetcher';
import PollItem from '../pollItem';
import PollData from '../pollData';

export default class StrawpollComHandler implements PollHandler {
    private _baseUrl = 'https://strawpoll.com/api/poll/';

    getPollData(link: string): Promise<PollData> {
        const matches = new RegExp('.*/([a-zA-Z0-9]*)').exec(link);

        if (!matches || matches[1] == '') return Promise.reject(new Error(`Invalid link ${link}`));

        const apiUrl = this._baseUrl + matches[1];

        return JsonFetcher.fetchDataFromUrl(apiUrl);
    }

    toPollItems(data: PollData): PollItem[] {
        const results: any[] = data.poll_answers;
        const pollItems: PollItem[] = results.map(x => new PollItem(x.answer, x.votes));
        pollItems.sort((a, b) => b.votes - a.votes);

        return pollItems;
    }
}
