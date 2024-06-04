import cron from 'node-cron';
import { updateCompletedEvents } from '../controller/event.controller';

cron.schedule('0 0 * * *', () => {
    console.log('Running the updateCompletedEvents job');
    updateCompletedEvents();
});
