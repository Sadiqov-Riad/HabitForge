type Listener = () => void;
let activeCount = 0;
const listeners = new Set<Listener>();
function emit() {
    for (const listener of listeners)
        listener();
}
export function globalLoadingStart() {
    activeCount += 1;
    emit();
}
export function globalLoadingStop() {
    activeCount = Math.max(0, activeCount - 1);
    emit();
}
export function globalLoadingGetCount() {
    return activeCount;
}
export function globalLoadingSubscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
