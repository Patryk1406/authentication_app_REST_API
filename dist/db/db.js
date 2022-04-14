import * as mysql from 'mysql2/promise';
export const pool = mysql.createPool({
    host: 'spryrr1myu6oalwl.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    user: 'ez7uewm9js9u67qi',
    database: 'yzt14wup3k4w8xny',
    password: 'lyrrxlcwhapyx8m0',
    decimalNumbers: true,
    namedPlaceholders: true,
    dateStrings: true,
});
//# sourceMappingURL=db.js.map