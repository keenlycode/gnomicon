import {
    bgColor
} from 'gadjet/src/gadjet';
import { addStyle } from '@devcapsule/adapter';

import { theme } from './color';

const css = String.raw;

addStyle(css`
#icons {
    padding-top: 2rem;
    ${bgColor(theme.eggShell)}
    h2 {
        text-align: center;
        margin: 0;
    }
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
}
`);