declare class PubSub {
    private subscribers;
    subscribe(topic: string, callback: (data: any) => void): () => void;
    publish(topic: string, data: any): void;
}
export declare const pubsub: PubSub;
export {};
//# sourceMappingURL=index.d.ts.map