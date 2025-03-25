import { Link } from 'react-router';

export default function HomePage() {
    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 text-4xl font-bold">Home Page</h1>
            <div className="my-4">
                <h2 className="mb-2 text-2xl font-black">Helper of MDN Web Docs Localization</h2>
                <p>
                    This is a helper tool for translating MDN Web Docs to boost the process of reviewing by checking the
                    difference between the translation and the current source.
                </p>
                <p>
                    Before using the tool, a GitHub access token may be generated and the token itself must have the
                    repository you want to access read permission. You need to set it
                    <Link to="/preferences" className="mx-2 text-orange-700 dark:text-orange-300">
                        Here
                    </Link>
                    . Without Access Token, your access to the GitHub Rest API may not be guaranteed.{' '}
                </p>
                <p>
                    Then you may navigate to
                    <Link to="/compare" className="mx-2 text-orange-700 dark:text-orange-300">
                        <code>/compare</code>
                    </Link>
                    page to compare and see the difference line by line between some documentation and{' '}
                    <code>mdn/content</code>'s latest one!
                </p>
                <p>
                    You may also navigate to
                    <Link to="/pr" className="mx-2 text-orange-700 dark:text-orange-300">
                        <code>/pr</code>
                    </Link>
                    page to quickly obtain the URLs of all files under a certain PR of the <b>compare</b> page.
                </p>
                <p className="my-16 text-center text-sm">
                    Copyright &copy; Hoarfroster and other collaborators 2025, all rights reserved.
                </p>
            </div>
        </main>
    );
}
