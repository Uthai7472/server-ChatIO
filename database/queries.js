const { pool } = require('./index');

const createMessagesTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(30),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query, (err, results) => {
            if (err) {
                console.log("Error create message table:", err);
            } else {
                console.log("Create message table successfully")
            }
        });
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

const insertMessagesTable = async (username, message) => {
    try {
        const query = `
            INSERT INTO messages (username, message) VALUES (?, ?)
        `;
        await pool.query(query, [username, message], (err, results) => {
            if (err) {
                console.log("Error insert message table:", err);
            } else {
                console.log("Insert message table successfully")
            }
        });

    } catch (error) {
        console.error('Error inserting table:', error);
    }
};

const getMessages = async () => {
    try {
        const query = 'SELECT * FROM messages';
        const results = await new Promise((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err) {
                    console.error('Error select messages:', err);
                    reject(err); // Reject the promise with the error
                } else {
                    console.log('Select messages successfully:', results);
                    resolve(results); // Resolve the promise with the results
                }
            });
        });
        return results;

    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

module.exports = {
    createMessagesTable,
    insertMessagesTable,
    getMessages
}