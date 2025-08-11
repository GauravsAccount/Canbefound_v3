import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ["name","email","password","collegeId","role"];

export default getInitPage({"listKey":"User","fieldPaths":["name","email","password","collegeId","role"],"enableWelcome":true});
