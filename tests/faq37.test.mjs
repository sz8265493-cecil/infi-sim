import test from 'node:test';
import assert from 'node:assert/strict';
import {FAQ_CASES,runFAQCase} from '../dist/faq-cases.js';
for(const c of FAQ_CASES)test(`FAQ 0.1: ${c.title}`,()=>{const result=runFAQCase(c.id);assert.equal(result.pass,true,JSON.stringify(result));});
