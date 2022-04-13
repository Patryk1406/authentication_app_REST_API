export class ValidationError extends Error {
}
export class NoUSerError extends Error {
}
export function errorHandler(err, req, res, next) {
    if (err instanceof ValidationError || err instanceof NoUSerError) {
        res.status(400).json({ message: err.message });
    }
    else {
        console.error(err.message);
        res.status(500).json({ message: 'Sorry, we have some internal problems, try again later;)' });
    }
}
//# sourceMappingURL=errors.js.map