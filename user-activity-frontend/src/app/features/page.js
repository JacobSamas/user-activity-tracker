export default function FeaturesPage() {
    return (
        <main className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Features</h1>
                <ul className="text-gray-600 list-disc list-inside space-y-2 text-left">
                    <li>Track user page views in real-time.</li>
                    <li>Log user clicks and interactions.</li>
                    <li>Detect idle and active states.</li>
                    <li>Provide analytics for user behavior.</li>
                </ul>
            </div>
        </main>
    );
}
