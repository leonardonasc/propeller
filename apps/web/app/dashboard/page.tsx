

export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Protected Content</h2>
                    <p>
                        This is a protected page that requires authentication. Only logged-in users can access this content.
                    </p>
                </div>
            </div>
        </div>
    )
}
