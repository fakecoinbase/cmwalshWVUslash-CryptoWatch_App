const initData = {
    useDarkMode: true
}

const userReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'SET_THEME':
        return {
            ...state,
            useDarkMode: action.useDarkMode
        }
    default:
        return {
            ...state
        }
    }
}

export default userReducer;