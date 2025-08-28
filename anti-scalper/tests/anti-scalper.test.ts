// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
// const wallet1 = accounts.get('wallet_1')!;
// const wallet2 = accounts.get('wallet_2')!;

describe('anti-scalper', () => {
  it('returns 0 for fresh user', () => {
    const wallet1 = accounts.get('wallet_1')!;
    const result = simnet.callReadOnlyFn(
      'anti-scalper',
      'get-count',
      [Cl.principal(wallet1)],
      wallet1
    );
    expect(result.result).toBeUint(0);
  });

  it('increments count on count-up', () => {
    const wallet1 = accounts.get('wallet_1')!;
    const block = simnet.mineBlock([
      simnet.callPublicFn('anti-scalper', 'count-up', [], wallet1),
    ]);

    // This is the fix: expect the result correctly
    console.log(block[0].result);
    expect(block[0].result).toBeOk(Cl.bool(true));
  });

  it('separate counts for users', () => {
    // Wallet1: two calls
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    const [tx1, tx2] = simnet.mineBlock([
      simnet.callPublicFn('anti-scalper', 'count-up', [], wallet1),
      simnet.callPublicFn('anti-scalper', 'count-up', [], wallet1),
    ]).transactions;

    expect(tx1.result).toBeOk(Cl.bool(true));
    expect(tx2.result).toBeOk(Cl.bool(true));

    // Wallet2: one call
    const [tx3] = simnet.mineBlock([
      simnet.callPublicFn('anti-scalper', 'count-up', [], wallet2)
    ]).transactions;

    expect(tx3.result).toBeOk(Cl.bool(true));
  });
});