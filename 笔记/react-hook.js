let isMount = true
let workInProgressHook = null

const fiber = {
    stateNode: App,
    memoizedState: null,
}

function useState(initialState) {
    let hook
    if (isMount) {
        hook = {
            memoizedState: initialState,
            next: null,
            queue: {
                pending: null,
            },
        }
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook
        } else {
            workInProgressHook.next = hook
        }
        workInProgressHook = hook
    } else {
        hook = workInProgressHook
        workInProgressHook = workInProgressHook.next
    }

    let baseState = hook.memoizedState
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next
        do {
            const action = firstUpdate.action
            baseState = action(baseState)
            firstUpdate = firstUpdate.next
        } while (firstUpdate !== hook.queue.pending.next)
        hook.queue.pending = null
    }
    hook.memoizedState = baseState
    return [baseState, dispatchAction.bind(null, hook.queue)]
}
function dispatchAction(queue, action) {
    const update = {
        action,
        next: null,
    }
    if (queue.pending === null) {
        update.next = update
    } else {
        update.next = queue.pending.next
        queue.pending.next = update
    }
    queue.pending = update
    schedule()
}
function schedule() {
     workInProgressHook = fiber.memoizedState
    const app = fiber.stateNode()
    isMount = false
    return { app, fiber }
}

function App() {
    const [num, updataNum] = useState(0)
    console.log('ismount', isMount)
    console.log(num)
    return {
        onClick() {
            updataNum((num) => num + 1)
        },
    }
}

window.app = schedule()
