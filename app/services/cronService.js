const cron = require('node-cron');
const Event = require('../models/Event');
const { createNotification } = require('../controllers/notificationController');

const startCronJobs = () => {
    //* * * * * pentru fiecare minut sau 0 8 * * * fpentru o data pe zi la ora 8
    cron.schedule('0 8 * * *', async () => {
        console.log("Running Daily Event Notification Job...");
        
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const dayAfterTomorrow = new Date(tomorrow);
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

            const eventsToday = await Event.find({
                date: { $gte: today, $lt: tomorrow },
                status: 'approved'
            });

            for (const event of eventsToday) {
                for (const userId of event.attendeesList) {
                    await createNotification(
                        userId,
                        'reminder',
                        'Evenimentul este Astăzi!',
                        `Nu uita, evenimentul "${event.title}" are loc astăzi la ora ${event.time}.`, 
                        event._id
                    );
                }
            }
            if (eventsToday.length > 0) console.log(`Sent "Today" reminders for ${eventsToday.length} events.`);



            const eventsTomorrow = await Event.find({
                date: { $gte: tomorrow, $lt: dayAfterTomorrow },
                status: 'approved'
            });

            for (const event of eventsTomorrow) {
                for (const userId of event.attendeesList) {
                    await createNotification(
                        userId,
                        'reminder',
                        'Evenimentul este Mâine!',
                        `Te așteptăm mâine la evenimentul "${event.title}".`,
                        event._id
                    );
                }
            }
            if (eventsTomorrow.length > 0) console.log(`Sent "Tomorrow" reminders for ${eventsTomorrow.length} events.`);

        } catch (error) {
            console.error("Error in cron job:", error);
        }
    });
};

module.exports = startCronJobs;