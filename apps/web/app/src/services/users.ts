

const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function getUser(headers: Record<string, string> = {}) {
    const response = await fetch(`${api_url}/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }
    return response.json();
}