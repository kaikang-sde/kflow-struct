import type { IComponent, IPage } from "..";


/**
 * PublishRequest is a type that represents the request body for the publish endpoint
 * Omit<T, K>: Remove K/a set of K from T
 * Omit<IPage, 'id' | 'account_id' | 'components'>: Remove 'id', 'account_id', 'components' from IPage
 * Omit<IComponent, 'page_id' | 'account_id'>: Remove 'page_id', 'account_id' from IComponent
 */
export type PublishRequest =
    Omit<IPage, 'id' | 'account_id' | 'components'>
    & { components: Omit<IComponent, 'page_id' | 'account_id'>[] };
