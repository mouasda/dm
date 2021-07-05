/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ClientContract extends Contract {

    async clientExists(ctx, clientId) {
        const buffer = await ctx.stub.getState(clientId);
        return (!!buffer && buffer.length > 0);
    }

    async createDocument(ctx, clientId, value) {
        const exists = await this.clientExists(ctx, clientId);
        if (exists) {
            throw new Error(`The client ${clientId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(clientId, buffer);
    }

    async readDocument(ctx, clientId) {
        const exists = await this.clientExists(ctx, clientId);
        if (!exists) {
            throw new Error(`The client ${clientId} does not exist`);
        }
        const buffer = await ctx.stub.getState(clientId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateDocument(ctx, clientId, newValue) {
        const exists = await this.clientExists(ctx, clientId);
        if (!exists) {
            throw new Error(`The client ${clientId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(clientId, buffer);
    }

    async deleteDocument(ctx, clientId) {
        const exists = await this.clientExists(ctx, clientId);
        if (!exists) {
            throw new Error(`The client ${clientId} does not exist`);
        }
        await ctx.stub.deleteState(clientId);
    }

}

module.exports = ClientContract;
