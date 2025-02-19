

const UserInfoDisplay = () => {
    return (
    <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-lg flex items-center space-x-4">
        <div>
            <p className="text-sm text-gray-600">Signed in as</p>
            <p id="profileName" className="text-sm font-medium text-gray-800">Guest</p>
        </div>
        <button
            id="SignOutButton"
            className="px-3 py-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
            Log Out
        </button>
    </div>
    );
};

export default UserInfoDisplay;
