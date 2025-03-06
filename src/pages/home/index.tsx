import React from "react";

export default function HomePage() {
    return (
        <main className="container mx-auto mt-4">
            <h1 className="text-4xl font-bold mb-8">Home Page</h1>
            <div className="my-4">
                <h2 className="font-black text-2xl mb-2">Helper of MDN Web Docs Localization</h2>
                <p>This is a helper tool for translating MDN Web Docs. Before using the tool, a
                    GitHub access token must be generated and the token itself must have the repository you want to
                    access read permission. Then you may navigate to <code>/compare</code> page to compare and see the
                    difference line by line between some documentation and <code>mdn/content</code>'s latest one!</p>
                <p className="text-center text-sm my-16">
                    Copyright &copy; Hoarfroster and other collaborators 2025, all rights reserved.
                </p>
            </div>
        </main>
    );
}
