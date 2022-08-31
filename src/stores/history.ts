const history = {
    past: [] as any[],
    future: [] as any[],
    present: undefined as any,
    hasRecord(type: 'past' | 'future'): boolean {
        return this[type].length > 0;
    },
    hasPresent() {
        return this.present !== undefined;
    },
    setPresent(state: any) {
        this.present = state;
    },
    clear(): void {
        this.past = []
        this.future = []
        this.present = undefined
    },
    push(currentState: any) {
        if (this.hasPresent()) {
            this.past.push(this.present);
        }
        this.setPresent(currentState);
        this.future = []
    },
    getIndex() {
        return this.past.length;
    },
    getLength() {
        const allState = [...this.past, this.present, ...this.future];
        return allState.length;
    },
    undo(count: number) {
        if (!count) {
            count = 1;
        }
        if (this.getIndex() < count) {
            return
        }
        if (this.hasRecord('past')) {
            this.gotoState(this.getIndex() - count);
        }
    },
    redo(count: number) {
        if (!count) {
            count = 1;
        }
        if (this.getLength() <= this.getIndex() + count) {
            return
        }
        if (this.hasRecord('future')) {
            this.gotoState(this.getIndex() + count);
        }
    },
    gotoState(i: any) {
        const index = i * 1;
        const allState = [...this.past, this.present, ...this.future];
        this.present = allState[index];
        this.past = allState.slice(0, index);
        this.future = allState.slice(index + 1, allState.length);
    }
};

export default history;

export const undo = (index: number) => {
    return {type: 'history/undo', payload: index}
}

export const redo = (index: number) => {
    return {type: 'history/redo', payload: index}
}

export const goto = (index: number) => {
    return {type: 'history/goto', payload: index}
}
