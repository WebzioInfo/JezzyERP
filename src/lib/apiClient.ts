/**
 * Standard API Client with Native Fetch
 * This ensures consistency across the app while using native web APIs
 * to reduce bundle size and leverage Next.js caching.
 */
class ApiClient {
    async post(url: string, data: any, options: any = {}) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const error = new Error(errorData.error || `HTTP error! status: ${res.status}`);
            (error as any).response = { data: errorData };
            throw error;
        }

        if (options.responseType === 'blob') {
            const blob = await res.blob();
            return {
                data: blob,
                headers: {
                    'content-disposition': res.headers.get('content-disposition'),
                },
            };
        }

        return { data: await res.json(), headers: res.headers };
    }

    async get(url: string, options: any = {}) {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const error = new Error(errorData.error || `HTTP error! status: ${res.status}`);
            (error as any).response = { data: errorData };
            throw error;
        }

        return { data: await res.json(), headers: res.headers };
    }
}

const apiClient = new ApiClient();
export default apiClient;

