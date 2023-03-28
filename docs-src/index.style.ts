import {
    addStyle,
    bgColor
} from 'gadjet/src/gadjet';

import { theme } from './color';

const css = addStyle;

css`
#hl1 {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    ${bgColor(theme.eggShell)}
    min-height: 100vh;
    > div {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    h1 {
        font-size: 3rem;
        width: 100%;
        margin: 0;
        el-badge {
            font-size: 0.4em;
        }
    }
    h2 {
        font-size: 1.5rem;
        width: 100%;
        margin: 0;
    }
    el-icon {
        margin: 0.5rem;
    }
}

#icons {
    padding-top: 2rem;
    ${bgColor(theme.eggShell)}
    h2 {
        text-align: center;
        margin: 0;
}

el-icon-manager {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 2rem;
}

el-icon-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    @media (max-width: 480px) {
        width: 3rem;
        margin: 0.5rem;
    }
    @media (min-width: 480px) {
        width: 5rem;
        margin: 0.5rem;
    }
    el-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        @media (max-width: 480px) {
            height: 3rem;
            font-size: 2rem;
        }
        @media (min-width: 480px) {
            height: 4rem;
            font-size: 2rem;
        }
    }
    div.name {
        display: flex;
        text-align: center;
        @media (max-width: 480px) {
            font-size: 0.7rem;
        }
        @media (min-width: 480px) {
            font-size: 0.9rem;
        }
    }
}`;