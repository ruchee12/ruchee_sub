'reach 0.1';
const common_func = {
    Seetimeout: Fun([UInt], Null)
}
export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        ...common_func,
        funds: UInt,
        lenofblocks: UInt,
        State: Fun([], Bool)
    })
    const Bob = Participant('Bob', {
        ...common_func,
        acceptfunds: Fun([UInt], Bool),
    })

    init()
    Alice.only(() => {
        const value = declassify(interact.funds)
        const lenofblocks = declassify(interact.lenofblocks)
    })
    Alice.publish(value, lenofblocks)
        .pay(value)
    commit()

    Bob.only(() => {
        const acceptfunds = declassify(interact.acceptfunds(value))
    })
    Bob.publish(acceptfunds)
    commit()
    Alice.only(() => {
        const Seealice = declassify(interact.Seetimeout(lenofblocks))
    })
    Alice.publish(Seealice)
    commit()

    Bob.only(() => {
        const Seebob = declassify(interact.Seetimeout(lenofblocks))
    })
    Bob.publish(Seebob)
    if (acceptfunds) {
        const end = lastConsensusTime() + lenofblocks
        const state_initial = true
        var Alice_state = state_initial
        invariant(balance() == value)
        while (lastConsensusTime() <= end) {
            commit()
            Alice.only(() => {
                const State = declassify(interact.State())
            })
            Alice.publish(State)
            Alice_state = State
            continue
        }

        if (Alice_state == true) {
            transfer(value).to(Alice)
        } else if (Alice_state == false) {
            transfer(value).to(Bob)
        }
    } else {
        transfer(value).to(Alice)
    }

    commit()

});
