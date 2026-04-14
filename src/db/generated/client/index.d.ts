
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Quotation
 * 
 */
export type Quotation = $Result.DefaultSelection<Prisma.$QuotationPayload>
/**
 * Model QuotationLineItem
 * 
 */
export type QuotationLineItem = $Result.DefaultSelection<Prisma.$QuotationLineItemPayload>
/**
 * Model CompanySetting
 * 
 */
export type CompanySetting = $Result.DefaultSelection<Prisma.$CompanySettingPayload>
/**
 * Model InvoiceLineItem
 * 
 */
export type InvoiceLineItem = $Result.DefaultSelection<Prisma.$InvoiceLineItemPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model Purchase
 * 
 */
export type Purchase = $Result.DefaultSelection<Prisma.$PurchasePayload>
/**
 * Model PurchaseLineItem
 * 
 */
export type PurchaseLineItem = $Result.DefaultSelection<Prisma.$PurchaseLineItemPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quotation`: Exposes CRUD operations for the **Quotation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quotations
    * const quotations = await prisma.quotation.findMany()
    * ```
    */
  get quotation(): Prisma.QuotationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quotationLineItem`: Exposes CRUD operations for the **QuotationLineItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuotationLineItems
    * const quotationLineItems = await prisma.quotationLineItem.findMany()
    * ```
    */
  get quotationLineItem(): Prisma.QuotationLineItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.companySetting`: Exposes CRUD operations for the **CompanySetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompanySettings
    * const companySettings = await prisma.companySetting.findMany()
    * ```
    */
  get companySetting(): Prisma.CompanySettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoiceLineItem`: Exposes CRUD operations for the **InvoiceLineItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceLineItems
    * const invoiceLineItems = await prisma.invoiceLineItem.findMany()
    * ```
    */
  get invoiceLineItem(): Prisma.InvoiceLineItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchase`: Exposes CRUD operations for the **Purchase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Purchases
    * const purchases = await prisma.purchase.findMany()
    * ```
    */
  get purchase(): Prisma.PurchaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseLineItem`: Exposes CRUD operations for the **PurchaseLineItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseLineItems
    * const purchaseLineItems = await prisma.purchaseLineItem.findMany()
    * ```
    */
  get purchaseLineItem(): Prisma.PurchaseLineItemDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Client: 'Client',
    Product: 'Product',
    Invoice: 'Invoice',
    Payment: 'Payment',
    Quotation: 'Quotation',
    QuotationLineItem: 'QuotationLineItem',
    CompanySetting: 'CompanySetting',
    InvoiceLineItem: 'InvoiceLineItem',
    AuditLog: 'AuditLog',
    Vendor: 'Vendor',
    Purchase: 'Purchase',
    PurchaseLineItem: 'PurchaseLineItem'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "client" | "product" | "invoice" | "payment" | "quotation" | "quotationLineItem" | "companySetting" | "invoiceLineItem" | "auditLog" | "vendor" | "purchase" | "purchaseLineItem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Quotation: {
        payload: Prisma.$QuotationPayload<ExtArgs>
        fields: Prisma.QuotationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          findFirst: {
            args: Prisma.QuotationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          findMany: {
            args: Prisma.QuotationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>[]
          }
          create: {
            args: Prisma.QuotationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          createMany: {
            args: Prisma.QuotationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QuotationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          update: {
            args: Prisma.QuotationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          deleteMany: {
            args: Prisma.QuotationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuotationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationPayload>
          }
          aggregate: {
            args: Prisma.QuotationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuotation>
          }
          groupBy: {
            args: Prisma.QuotationGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotationGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotationCountArgs<ExtArgs>
            result: $Utils.Optional<QuotationCountAggregateOutputType> | number
          }
        }
      }
      QuotationLineItem: {
        payload: Prisma.$QuotationLineItemPayload<ExtArgs>
        fields: Prisma.QuotationLineItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuotationLineItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuotationLineItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          findFirst: {
            args: Prisma.QuotationLineItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuotationLineItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          findMany: {
            args: Prisma.QuotationLineItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>[]
          }
          create: {
            args: Prisma.QuotationLineItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          createMany: {
            args: Prisma.QuotationLineItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.QuotationLineItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          update: {
            args: Prisma.QuotationLineItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          deleteMany: {
            args: Prisma.QuotationLineItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuotationLineItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuotationLineItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuotationLineItemPayload>
          }
          aggregate: {
            args: Prisma.QuotationLineItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuotationLineItem>
          }
          groupBy: {
            args: Prisma.QuotationLineItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuotationLineItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuotationLineItemCountArgs<ExtArgs>
            result: $Utils.Optional<QuotationLineItemCountAggregateOutputType> | number
          }
        }
      }
      CompanySetting: {
        payload: Prisma.$CompanySettingPayload<ExtArgs>
        fields: Prisma.CompanySettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanySettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanySettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          findFirst: {
            args: Prisma.CompanySettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanySettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          findMany: {
            args: Prisma.CompanySettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>[]
          }
          create: {
            args: Prisma.CompanySettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          createMany: {
            args: Prisma.CompanySettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CompanySettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          update: {
            args: Prisma.CompanySettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          deleteMany: {
            args: Prisma.CompanySettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanySettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanySettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          aggregate: {
            args: Prisma.CompanySettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompanySetting>
          }
          groupBy: {
            args: Prisma.CompanySettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanySettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanySettingCountArgs<ExtArgs>
            result: $Utils.Optional<CompanySettingCountAggregateOutputType> | number
          }
        }
      }
      InvoiceLineItem: {
        payload: Prisma.$InvoiceLineItemPayload<ExtArgs>
        fields: Prisma.InvoiceLineItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceLineItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          findFirst: {
            args: Prisma.InvoiceLineItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceLineItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          findMany: {
            args: Prisma.InvoiceLineItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>[]
          }
          create: {
            args: Prisma.InvoiceLineItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          createMany: {
            args: Prisma.InvoiceLineItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InvoiceLineItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          update: {
            args: Prisma.InvoiceLineItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceLineItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceLineItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceLineItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLineItemPayload>
          }
          aggregate: {
            args: Prisma.InvoiceLineItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceLineItem>
          }
          groupBy: {
            args: Prisma.InvoiceLineItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceLineItemCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineItemCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      Purchase: {
        payload: Prisma.$PurchasePayload<ExtArgs>
        fields: Prisma.PurchaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findFirst: {
            args: Prisma.PurchaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          findMany: {
            args: Prisma.PurchaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>[]
          }
          create: {
            args: Prisma.PurchaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          createMany: {
            args: Prisma.PurchaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          update: {
            args: Prisma.PurchaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          deleteMany: {
            args: Prisma.PurchaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasePayload>
          }
          aggregate: {
            args: Prisma.PurchaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchase>
          }
          groupBy: {
            args: Prisma.PurchaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseCountAggregateOutputType> | number
          }
        }
      }
      PurchaseLineItem: {
        payload: Prisma.$PurchaseLineItemPayload<ExtArgs>
        fields: Prisma.PurchaseLineItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseLineItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseLineItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          findFirst: {
            args: Prisma.PurchaseLineItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseLineItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          findMany: {
            args: Prisma.PurchaseLineItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>[]
          }
          create: {
            args: Prisma.PurchaseLineItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          createMany: {
            args: Prisma.PurchaseLineItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PurchaseLineItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          update: {
            args: Prisma.PurchaseLineItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseLineItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseLineItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PurchaseLineItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseLineItemPayload>
          }
          aggregate: {
            args: Prisma.PurchaseLineItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseLineItem>
          }
          groupBy: {
            args: Prisma.PurchaseLineItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseLineItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseLineItemCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseLineItemCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    client?: ClientOmit
    product?: ProductOmit
    invoice?: InvoiceOmit
    payment?: PaymentOmit
    quotation?: QuotationOmit
    quotationLineItem?: QuotationLineItemOmit
    companySetting?: CompanySettingOmit
    invoiceLineItem?: InvoiceLineItemOmit
    auditLog?: AuditLogOmit
    vendor?: VendorOmit
    purchase?: PurchaseOmit
    purchaseLineItem?: PurchaseLineItemOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    createdAudits: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdAudits?: boolean | UserCountOutputTypeCountCreatedAuditsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    invoices: number
    quotations: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | ClientCountOutputTypeCountInvoicesArgs
    quotations?: boolean | ClientCountOutputTypeCountQuotationsArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountQuotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    invoiceLines: number
    quotationLines: number
    purchaseLines: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | ProductCountOutputTypeCountInvoiceLinesArgs
    quotationLines?: boolean | ProductCountOutputTypeCountQuotationLinesArgs
    purchaseLines?: boolean | ProductCountOutputTypeCountPurchaseLinesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountInvoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountQuotationLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountPurchaseLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseLineItemWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    lineItems: number
    payments: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | InvoiceCountOutputTypeCountLineItemsArgs
    payments?: boolean | InvoiceCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineItemWhereInput
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Count Type QuotationCountOutputType
   */

  export type QuotationCountOutputType = {
    lineItems: number
  }

  export type QuotationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | QuotationCountOutputTypeCountLineItemsArgs
  }

  // Custom InputTypes
  /**
   * QuotationCountOutputType without action
   */
  export type QuotationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationCountOutputType
     */
    select?: QuotationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuotationCountOutputType without action
   */
  export type QuotationCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
  }


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    purchases: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchases?: boolean | VendorCountOutputTypeCountPurchasesArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountPurchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
  }


  /**
   * Count Type PurchaseCountOutputType
   */

  export type PurchaseCountOutputType = {
    lineItems: number
  }

  export type PurchaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | PurchaseCountOutputTypeCountLineItemsArgs
  }

  // Custom InputTypes
  /**
   * PurchaseCountOutputType without action
   */
  export type PurchaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseCountOutputType
     */
    select?: PurchaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PurchaseCountOutputType without action
   */
  export type PurchaseCountOutputTypeCountLineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseLineItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLogins: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLogins: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: string | null
    lastLoginAt: Date | null
    lastLoginIp: string | null
    failedLogins: number | null
    isLockedOut: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: string | null
    lastLoginAt: Date | null
    lastLoginIp: string | null
    failedLogins: number | null
    isLockedOut: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    role: number
    lastLoginAt: number
    lastLoginIp: number
    failedLogins: number
    isLockedOut: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLogins?: true
  }

  export type UserSumAggregateInputType = {
    failedLogins?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    lastLoginAt?: true
    lastLoginIp?: true
    failedLogins?: true
    isLockedOut?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    lastLoginAt?: true
    lastLoginIp?: true
    failedLogins?: true
    isLockedOut?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    lastLoginAt?: true
    lastLoginIp?: true
    failedLogins?: true
    isLockedOut?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    passwordHash: string
    role: string
    lastLoginAt: Date | null
    lastLoginIp: string | null
    failedLogins: number
    isLockedOut: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    failedLogins?: boolean
    isLockedOut?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdAudits?: boolean | User$createdAuditsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    lastLoginAt?: boolean
    lastLoginIp?: boolean
    failedLogins?: boolean
    isLockedOut?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "role" | "lastLoginAt" | "lastLoginIp" | "failedLogins" | "isLockedOut" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdAudits?: boolean | User$createdAuditsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      createdAudits: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      passwordHash: string
      role: string
      lastLoginAt: Date | null
      lastLoginIp: string | null
      failedLogins: number
      isLockedOut: boolean
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdAudits<T extends User$createdAuditsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdAuditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly lastLoginIp: FieldRef<"User", 'String'>
    readonly failedLogins: FieldRef<"User", 'Int'>
    readonly isLockedOut: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.createdAudits
   */
  export type User$createdAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    name: string | null
    gst: string | null
    email: string | null
    phone: string | null
    address1: string | null
    address2: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    gst: string | null
    email: string | null
    phone: string | null
    address1: string | null
    address2: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    name: number
    gst: number
    email: number
    phone: number
    address1: number
    address2: number
    state: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    createdById: number
    updatedById: number
    pinCode: number
    active: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    name: string
    gst: string | null
    email: string | null
    phone: string | null
    address1: string
    address2: string | null
    state: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gst?: boolean
    email?: boolean
    phone?: boolean
    address1?: boolean
    address2?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    pinCode?: boolean
    active?: boolean
    invoices?: boolean | Client$invoicesArgs<ExtArgs>
    quotations?: boolean | Client$quotationsArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>



  export type ClientSelectScalar = {
    id?: boolean
    name?: boolean
    gst?: boolean
    email?: boolean
    phone?: boolean
    address1?: boolean
    address2?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    pinCode?: boolean
    active?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "gst" | "email" | "phone" | "address1" | "address2" | "state" | "createdAt" | "updatedAt" | "deletedAt" | "createdById" | "updatedById" | "pinCode" | "active", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoices?: boolean | Client$invoicesArgs<ExtArgs>
    quotations?: boolean | Client$quotationsArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      quotations: Prisma.$QuotationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      gst: string | null
      email: string | null
      phone: string | null
      address1: string
      address2: string | null
      state: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      createdById: string | null
      updatedById: string | null
      pinCode: string | null
      active: boolean
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoices<T extends Client$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Client$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quotations<T extends Client$quotationsArgs<ExtArgs> = {}>(args?: Subset<T, Client$quotationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly name: FieldRef<"Client", 'String'>
    readonly gst: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
    readonly address1: FieldRef<"Client", 'String'>
    readonly address2: FieldRef<"Client", 'String'>
    readonly state: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
    readonly deletedAt: FieldRef<"Client", 'DateTime'>
    readonly createdById: FieldRef<"Client", 'String'>
    readonly updatedById: FieldRef<"Client", 'String'>
    readonly pinCode: FieldRef<"Client", 'String'>
    readonly active: FieldRef<"Client", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.invoices
   */
  export type Client$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Client.quotations
   */
  export type Client$quotationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    where?: QuotationWhereInput
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    cursor?: QuotationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    gstRate: Decimal | null
    purchaseRate: Decimal | null
    sellingRate: Decimal | null
  }

  export type ProductSumAggregateOutputType = {
    gstRate: Decimal | null
    purchaseRate: Decimal | null
    sellingRate: Decimal | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    sku: string | null
    description: string | null
    hsn: string | null
    gstRate: Decimal | null
    unit: string | null
    notes: string | null
    pkgType: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    active: boolean | null
    purchaseRate: Decimal | null
    sellingRate: Decimal | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    sku: string | null
    description: string | null
    hsn: string | null
    gstRate: Decimal | null
    unit: string | null
    notes: string | null
    pkgType: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    active: boolean | null
    purchaseRate: Decimal | null
    sellingRate: Decimal | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    sku: number
    description: number
    hsn: number
    gstRate: number
    unit: number
    notes: number
    pkgType: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    active: number
    purchaseRate: number
    sellingRate: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    gstRate?: true
    purchaseRate?: true
    sellingRate?: true
  }

  export type ProductSumAggregateInputType = {
    gstRate?: true
    purchaseRate?: true
    sellingRate?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    sku?: true
    description?: true
    hsn?: true
    gstRate?: true
    unit?: true
    notes?: true
    pkgType?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    active?: true
    purchaseRate?: true
    sellingRate?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    sku?: true
    description?: true
    hsn?: true
    gstRate?: true
    unit?: true
    notes?: true
    pkgType?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    active?: true
    purchaseRate?: true
    sellingRate?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    sku?: true
    description?: true
    hsn?: true
    gstRate?: true
    unit?: true
    notes?: true
    pkgType?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    active?: true
    purchaseRate?: true
    sellingRate?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    sku: string | null
    description: string
    hsn: string | null
    gstRate: Decimal
    unit: string
    notes: string | null
    pkgType: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    active: boolean
    purchaseRate: Decimal
    sellingRate: Decimal
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    description?: boolean
    hsn?: boolean
    gstRate?: boolean
    unit?: boolean
    notes?: boolean
    pkgType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    active?: boolean
    purchaseRate?: boolean
    sellingRate?: boolean
    invoiceLines?: boolean | Product$invoiceLinesArgs<ExtArgs>
    quotationLines?: boolean | Product$quotationLinesArgs<ExtArgs>
    purchaseLines?: boolean | Product$purchaseLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>



  export type ProductSelectScalar = {
    id?: boolean
    sku?: boolean
    description?: boolean
    hsn?: boolean
    gstRate?: boolean
    unit?: boolean
    notes?: boolean
    pkgType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    active?: boolean
    purchaseRate?: boolean
    sellingRate?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sku" | "description" | "hsn" | "gstRate" | "unit" | "notes" | "pkgType" | "createdAt" | "updatedAt" | "deletedAt" | "active" | "purchaseRate" | "sellingRate", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | Product$invoiceLinesArgs<ExtArgs>
    quotationLines?: boolean | Product$quotationLinesArgs<ExtArgs>
    purchaseLines?: boolean | Product$purchaseLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      invoiceLines: Prisma.$InvoiceLineItemPayload<ExtArgs>[]
      quotationLines: Prisma.$QuotationLineItemPayload<ExtArgs>[]
      purchaseLines: Prisma.$PurchaseLineItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sku: string | null
      description: string
      hsn: string | null
      gstRate: Prisma.Decimal
      unit: string
      notes: string | null
      pkgType: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      active: boolean
      purchaseRate: Prisma.Decimal
      sellingRate: Prisma.Decimal
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoiceLines<T extends Product$invoiceLinesArgs<ExtArgs> = {}>(args?: Subset<T, Product$invoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    quotationLines<T extends Product$quotationLinesArgs<ExtArgs> = {}>(args?: Subset<T, Product$quotationLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    purchaseLines<T extends Product$purchaseLinesArgs<ExtArgs> = {}>(args?: Subset<T, Product$purchaseLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly hsn: FieldRef<"Product", 'String'>
    readonly gstRate: FieldRef<"Product", 'Decimal'>
    readonly unit: FieldRef<"Product", 'String'>
    readonly notes: FieldRef<"Product", 'String'>
    readonly pkgType: FieldRef<"Product", 'String'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
    readonly deletedAt: FieldRef<"Product", 'DateTime'>
    readonly active: FieldRef<"Product", 'Boolean'>
    readonly purchaseRate: FieldRef<"Product", 'Decimal'>
    readonly sellingRate: FieldRef<"Product", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.invoiceLines
   */
  export type Product$invoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    where?: InvoiceLineItemWhereInput
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    cursor?: InvoiceLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * Product.quotationLines
   */
  export type Product$quotationLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    cursor?: QuotationLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * Product.purchaseLines
   */
  export type Product$purchaseLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    where?: PurchaseLineItemWhereInput
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    cursor?: PurchaseLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseLineItemScalarFieldEnum | PurchaseLineItemScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
  }

  export type InvoiceSumAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    sequenceNumber: number | null
    invoiceNo: string | null
    date: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
    status: string | null
    ewayBill: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean | null
    shippingState: string | null
    ewayBillUrl: string | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    sequenceNumber: number | null
    invoiceNo: string | null
    date: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
    status: string | null
    ewayBill: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean | null
    shippingState: string | null
    ewayBillUrl: string | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    clientId: number
    sequenceNumber: number
    invoiceNo: number
    date: number
    gstType: number
    subTotal: number
    taxTotal: number
    grandTotal: number
    amountPaid: number
    status: number
    ewayBill: number
    vehicleNo: number
    dispatchedThrough: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    createdById: number
    notes: number
    billingAddress1: number
    billingAddress2: number
    billingGst: number
    billingName: number
    billingPhone: number
    billingPinCode: number
    billingState: number
    shippingAddress1: number
    shippingAddress2: number
    shippingName: number
    shippingPinCode: number
    shippingSameAsBilling: number
    shippingState: number
    ewayBillUrl: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
  }

  export type InvoiceSumAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    invoiceNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
    ewayBillUrl?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    invoiceNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
    ewayBillUrl?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    invoiceNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
    ewayBillUrl?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    clientId: string
    sequenceNumber: number
    invoiceNo: string
    date: Date
    gstType: string
    subTotal: Decimal
    taxTotal: Decimal
    grandTotal: Decimal
    amountPaid: Decimal
    status: string
    ewayBill: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean
    shippingState: string | null
    ewayBillUrl: string | null
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    sequenceNumber?: boolean
    invoiceNo?: boolean
    date?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    amountPaid?: boolean
    status?: boolean
    ewayBill?: boolean
    vehicleNo?: boolean
    dispatchedThrough?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    notes?: boolean
    billingAddress1?: boolean
    billingAddress2?: boolean
    billingGst?: boolean
    billingName?: boolean
    billingPhone?: boolean
    billingPinCode?: boolean
    billingState?: boolean
    shippingAddress1?: boolean
    shippingAddress2?: boolean
    shippingName?: boolean
    shippingPinCode?: boolean
    shippingSameAsBilling?: boolean
    shippingState?: boolean
    ewayBillUrl?: boolean
    lineItems?: boolean | Invoice$lineItemsArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    payments?: boolean | Invoice$paymentsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>



  export type InvoiceSelectScalar = {
    id?: boolean
    clientId?: boolean
    sequenceNumber?: boolean
    invoiceNo?: boolean
    date?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    amountPaid?: boolean
    status?: boolean
    ewayBill?: boolean
    vehicleNo?: boolean
    dispatchedThrough?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    notes?: boolean
    billingAddress1?: boolean
    billingAddress2?: boolean
    billingGst?: boolean
    billingName?: boolean
    billingPhone?: boolean
    billingPinCode?: boolean
    billingState?: boolean
    shippingAddress1?: boolean
    shippingAddress2?: boolean
    shippingName?: boolean
    shippingPinCode?: boolean
    shippingSameAsBilling?: boolean
    shippingState?: boolean
    ewayBillUrl?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "sequenceNumber" | "invoiceNo" | "date" | "gstType" | "subTotal" | "taxTotal" | "grandTotal" | "amountPaid" | "status" | "ewayBill" | "vehicleNo" | "dispatchedThrough" | "createdAt" | "updatedAt" | "deletedAt" | "createdById" | "notes" | "billingAddress1" | "billingAddress2" | "billingGst" | "billingName" | "billingPhone" | "billingPinCode" | "billingState" | "shippingAddress1" | "shippingAddress2" | "shippingName" | "shippingPinCode" | "shippingSameAsBilling" | "shippingState" | "ewayBillUrl", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | Invoice$lineItemsArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    payments?: boolean | Invoice$paymentsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      lineItems: Prisma.$InvoiceLineItemPayload<ExtArgs>[]
      client: Prisma.$ClientPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      sequenceNumber: number
      invoiceNo: string
      date: Date
      gstType: string
      subTotal: Prisma.Decimal
      taxTotal: Prisma.Decimal
      grandTotal: Prisma.Decimal
      amountPaid: Prisma.Decimal
      status: string
      ewayBill: string | null
      vehicleNo: string | null
      dispatchedThrough: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      createdById: string | null
      notes: string | null
      billingAddress1: string | null
      billingAddress2: string | null
      billingGst: string | null
      billingName: string | null
      billingPhone: string | null
      billingPinCode: string | null
      billingState: string | null
      shippingAddress1: string | null
      shippingAddress2: string | null
      shippingName: string | null
      shippingPinCode: string | null
      shippingSameAsBilling: boolean
      shippingState: string | null
      ewayBillUrl: string | null
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lineItems<T extends Invoice$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payments<T extends Invoice$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly clientId: FieldRef<"Invoice", 'String'>
    readonly sequenceNumber: FieldRef<"Invoice", 'Int'>
    readonly invoiceNo: FieldRef<"Invoice", 'String'>
    readonly date: FieldRef<"Invoice", 'DateTime'>
    readonly gstType: FieldRef<"Invoice", 'String'>
    readonly subTotal: FieldRef<"Invoice", 'Decimal'>
    readonly taxTotal: FieldRef<"Invoice", 'Decimal'>
    readonly grandTotal: FieldRef<"Invoice", 'Decimal'>
    readonly amountPaid: FieldRef<"Invoice", 'Decimal'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly ewayBill: FieldRef<"Invoice", 'String'>
    readonly vehicleNo: FieldRef<"Invoice", 'String'>
    readonly dispatchedThrough: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
    readonly deletedAt: FieldRef<"Invoice", 'DateTime'>
    readonly createdById: FieldRef<"Invoice", 'String'>
    readonly notes: FieldRef<"Invoice", 'String'>
    readonly billingAddress1: FieldRef<"Invoice", 'String'>
    readonly billingAddress2: FieldRef<"Invoice", 'String'>
    readonly billingGst: FieldRef<"Invoice", 'String'>
    readonly billingName: FieldRef<"Invoice", 'String'>
    readonly billingPhone: FieldRef<"Invoice", 'String'>
    readonly billingPinCode: FieldRef<"Invoice", 'String'>
    readonly billingState: FieldRef<"Invoice", 'String'>
    readonly shippingAddress1: FieldRef<"Invoice", 'String'>
    readonly shippingAddress2: FieldRef<"Invoice", 'String'>
    readonly shippingName: FieldRef<"Invoice", 'String'>
    readonly shippingPinCode: FieldRef<"Invoice", 'String'>
    readonly shippingSameAsBilling: FieldRef<"Invoice", 'Boolean'>
    readonly shippingState: FieldRef<"Invoice", 'String'>
    readonly ewayBillUrl: FieldRef<"Invoice", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice.lineItems
   */
  export type Invoice$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    where?: InvoiceLineItemWhereInput
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    cursor?: InvoiceLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * Invoice.payments
   */
  export type Invoice$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    amount: Decimal | null
    paidAt: Date | null
    method: string | null
    reference: string | null
    notes: string | null
    recordedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    amount: Decimal | null
    paidAt: Date | null
    method: string | null
    reference: string | null
    notes: string | null
    recordedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    invoiceId: number
    amount: number
    paidAt: number
    method: number
    reference: number
    notes: number
    recordedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    invoiceId?: true
    amount?: true
    paidAt?: true
    method?: true
    reference?: true
    notes?: true
    recordedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    amount?: true
    paidAt?: true
    method?: true
    reference?: true
    notes?: true
    recordedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    invoiceId?: true
    amount?: true
    paidAt?: true
    method?: true
    reference?: true
    notes?: true
    recordedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    invoiceId: string
    amount: Decimal
    paidAt: Date
    method: string
    reference: string | null
    notes: string | null
    recordedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    amount?: boolean
    paidAt?: boolean
    method?: boolean
    reference?: boolean
    notes?: boolean
    recordedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>



  export type PaymentSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    amount?: boolean
    paidAt?: boolean
    method?: boolean
    reference?: boolean
    notes?: boolean
    recordedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "amount" | "paidAt" | "method" | "reference" | "notes" | "recordedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      amount: Prisma.Decimal
      paidAt: Date
      method: string
      reference: string | null
      notes: string | null
      recordedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly invoiceId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly paidAt: FieldRef<"Payment", 'DateTime'>
    readonly method: FieldRef<"Payment", 'String'>
    readonly reference: FieldRef<"Payment", 'String'>
    readonly notes: FieldRef<"Payment", 'String'>
    readonly recordedBy: FieldRef<"Payment", 'String'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Quotation
   */

  export type AggregateQuotation = {
    _count: QuotationCountAggregateOutputType | null
    _avg: QuotationAvgAggregateOutputType | null
    _sum: QuotationSumAggregateOutputType | null
    _min: QuotationMinAggregateOutputType | null
    _max: QuotationMaxAggregateOutputType | null
  }

  export type QuotationAvgAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
  }

  export type QuotationSumAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
  }

  export type QuotationMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    sequenceNumber: number | null
    quotationNo: string | null
    date: Date | null
    validUntil: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    status: string | null
    convertedInvoiceId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean | null
    shippingState: string | null
  }

  export type QuotationMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    sequenceNumber: number | null
    quotationNo: string | null
    date: Date | null
    validUntil: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    status: string | null
    convertedInvoiceId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean | null
    shippingState: string | null
  }

  export type QuotationCountAggregateOutputType = {
    id: number
    clientId: number
    sequenceNumber: number
    quotationNo: number
    date: number
    validUntil: number
    gstType: number
    subTotal: number
    taxTotal: number
    grandTotal: number
    status: number
    convertedInvoiceId: number
    notes: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    createdById: number
    billingAddress1: number
    billingAddress2: number
    billingGst: number
    billingName: number
    billingPhone: number
    billingPinCode: number
    billingState: number
    shippingAddress1: number
    shippingAddress2: number
    shippingName: number
    shippingPinCode: number
    shippingSameAsBilling: number
    shippingState: number
    _all: number
  }


  export type QuotationAvgAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
  }

  export type QuotationSumAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
  }

  export type QuotationMinAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    quotationNo?: true
    date?: true
    validUntil?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    status?: true
    convertedInvoiceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
  }

  export type QuotationMaxAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    quotationNo?: true
    date?: true
    validUntil?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    status?: true
    convertedInvoiceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
  }

  export type QuotationCountAggregateInputType = {
    id?: true
    clientId?: true
    sequenceNumber?: true
    quotationNo?: true
    date?: true
    validUntil?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    status?: true
    convertedInvoiceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    billingAddress1?: true
    billingAddress2?: true
    billingGst?: true
    billingName?: true
    billingPhone?: true
    billingPinCode?: true
    billingState?: true
    shippingAddress1?: true
    shippingAddress2?: true
    shippingName?: true
    shippingPinCode?: true
    shippingSameAsBilling?: true
    shippingState?: true
    _all?: true
  }

  export type QuotationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotation to aggregate.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quotations
    **/
    _count?: true | QuotationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotationMaxAggregateInputType
  }

  export type GetQuotationAggregateType<T extends QuotationAggregateArgs> = {
        [P in keyof T & keyof AggregateQuotation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuotation[P]>
      : GetScalarType<T[P], AggregateQuotation[P]>
  }




  export type QuotationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationWhereInput
    orderBy?: QuotationOrderByWithAggregationInput | QuotationOrderByWithAggregationInput[]
    by: QuotationScalarFieldEnum[] | QuotationScalarFieldEnum
    having?: QuotationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotationCountAggregateInputType | true
    _avg?: QuotationAvgAggregateInputType
    _sum?: QuotationSumAggregateInputType
    _min?: QuotationMinAggregateInputType
    _max?: QuotationMaxAggregateInputType
  }

  export type QuotationGroupByOutputType = {
    id: string
    clientId: string
    sequenceNumber: number
    quotationNo: string
    date: Date
    validUntil: Date | null
    gstType: string
    subTotal: Decimal
    taxTotal: Decimal
    grandTotal: Decimal
    status: string
    convertedInvoiceId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    createdById: string | null
    billingAddress1: string | null
    billingAddress2: string | null
    billingGst: string | null
    billingName: string | null
    billingPhone: string | null
    billingPinCode: string | null
    billingState: string | null
    shippingAddress1: string | null
    shippingAddress2: string | null
    shippingName: string | null
    shippingPinCode: string | null
    shippingSameAsBilling: boolean
    shippingState: string | null
    _count: QuotationCountAggregateOutputType | null
    _avg: QuotationAvgAggregateOutputType | null
    _sum: QuotationSumAggregateOutputType | null
    _min: QuotationMinAggregateOutputType | null
    _max: QuotationMaxAggregateOutputType | null
  }

  type GetQuotationGroupByPayload<T extends QuotationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotationGroupByOutputType[P]>
            : GetScalarType<T[P], QuotationGroupByOutputType[P]>
        }
      >
    >


  export type QuotationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    sequenceNumber?: boolean
    quotationNo?: boolean
    date?: boolean
    validUntil?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    status?: boolean
    convertedInvoiceId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    billingAddress1?: boolean
    billingAddress2?: boolean
    billingGst?: boolean
    billingName?: boolean
    billingPhone?: boolean
    billingPinCode?: boolean
    billingState?: boolean
    shippingAddress1?: boolean
    shippingAddress2?: boolean
    shippingName?: boolean
    shippingPinCode?: boolean
    shippingSameAsBilling?: boolean
    shippingState?: boolean
    lineItems?: boolean | Quotation$lineItemsArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    _count?: boolean | QuotationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quotation"]>



  export type QuotationSelectScalar = {
    id?: boolean
    clientId?: boolean
    sequenceNumber?: boolean
    quotationNo?: boolean
    date?: boolean
    validUntil?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    status?: boolean
    convertedInvoiceId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    billingAddress1?: boolean
    billingAddress2?: boolean
    billingGst?: boolean
    billingName?: boolean
    billingPhone?: boolean
    billingPinCode?: boolean
    billingState?: boolean
    shippingAddress1?: boolean
    shippingAddress2?: boolean
    shippingName?: boolean
    shippingPinCode?: boolean
    shippingSameAsBilling?: boolean
    shippingState?: boolean
  }

  export type QuotationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "sequenceNumber" | "quotationNo" | "date" | "validUntil" | "gstType" | "subTotal" | "taxTotal" | "grandTotal" | "status" | "convertedInvoiceId" | "notes" | "createdAt" | "updatedAt" | "deletedAt" | "createdById" | "billingAddress1" | "billingAddress2" | "billingGst" | "billingName" | "billingPhone" | "billingPinCode" | "billingState" | "shippingAddress1" | "shippingAddress2" | "shippingName" | "shippingPinCode" | "shippingSameAsBilling" | "shippingState", ExtArgs["result"]["quotation"]>
  export type QuotationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | Quotation$lineItemsArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    _count?: boolean | QuotationCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $QuotationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quotation"
    objects: {
      lineItems: Prisma.$QuotationLineItemPayload<ExtArgs>[]
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      sequenceNumber: number
      quotationNo: string
      date: Date
      validUntil: Date | null
      gstType: string
      subTotal: Prisma.Decimal
      taxTotal: Prisma.Decimal
      grandTotal: Prisma.Decimal
      status: string
      convertedInvoiceId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      createdById: string | null
      billingAddress1: string | null
      billingAddress2: string | null
      billingGst: string | null
      billingName: string | null
      billingPhone: string | null
      billingPinCode: string | null
      billingState: string | null
      shippingAddress1: string | null
      shippingAddress2: string | null
      shippingName: string | null
      shippingPinCode: string | null
      shippingSameAsBilling: boolean
      shippingState: string | null
    }, ExtArgs["result"]["quotation"]>
    composites: {}
  }

  type QuotationGetPayload<S extends boolean | null | undefined | QuotationDefaultArgs> = $Result.GetResult<Prisma.$QuotationPayload, S>

  type QuotationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuotationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuotationCountAggregateInputType | true
    }

  export interface QuotationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quotation'], meta: { name: 'Quotation' } }
    /**
     * Find zero or one Quotation that matches the filter.
     * @param {QuotationFindUniqueArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotationFindUniqueArgs>(args: SelectSubset<T, QuotationFindUniqueArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Quotation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuotationFindUniqueOrThrowArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotationFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quotation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindFirstArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotationFindFirstArgs>(args?: SelectSubset<T, QuotationFindFirstArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quotation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindFirstOrThrowArgs} args - Arguments to find a Quotation
     * @example
     * // Get one Quotation
     * const quotation = await prisma.quotation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotationFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotationFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Quotations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quotations
     * const quotations = await prisma.quotation.findMany()
     * 
     * // Get first 10 Quotations
     * const quotations = await prisma.quotation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotationWithIdOnly = await prisma.quotation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotationFindManyArgs>(args?: SelectSubset<T, QuotationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Quotation.
     * @param {QuotationCreateArgs} args - Arguments to create a Quotation.
     * @example
     * // Create one Quotation
     * const Quotation = await prisma.quotation.create({
     *   data: {
     *     // ... data to create a Quotation
     *   }
     * })
     * 
     */
    create<T extends QuotationCreateArgs>(args: SelectSubset<T, QuotationCreateArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Quotations.
     * @param {QuotationCreateManyArgs} args - Arguments to create many Quotations.
     * @example
     * // Create many Quotations
     * const quotation = await prisma.quotation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotationCreateManyArgs>(args?: SelectSubset<T, QuotationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Quotation.
     * @param {QuotationDeleteArgs} args - Arguments to delete one Quotation.
     * @example
     * // Delete one Quotation
     * const Quotation = await prisma.quotation.delete({
     *   where: {
     *     // ... filter to delete one Quotation
     *   }
     * })
     * 
     */
    delete<T extends QuotationDeleteArgs>(args: SelectSubset<T, QuotationDeleteArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Quotation.
     * @param {QuotationUpdateArgs} args - Arguments to update one Quotation.
     * @example
     * // Update one Quotation
     * const quotation = await prisma.quotation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotationUpdateArgs>(args: SelectSubset<T, QuotationUpdateArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Quotations.
     * @param {QuotationDeleteManyArgs} args - Arguments to filter Quotations to delete.
     * @example
     * // Delete a few Quotations
     * const { count } = await prisma.quotation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotationDeleteManyArgs>(args?: SelectSubset<T, QuotationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quotations
     * const quotation = await prisma.quotation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotationUpdateManyArgs>(args: SelectSubset<T, QuotationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Quotation.
     * @param {QuotationUpsertArgs} args - Arguments to update or create a Quotation.
     * @example
     * // Update or create a Quotation
     * const quotation = await prisma.quotation.upsert({
     *   create: {
     *     // ... data to create a Quotation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quotation we want to update
     *   }
     * })
     */
    upsert<T extends QuotationUpsertArgs>(args: SelectSubset<T, QuotationUpsertArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Quotations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationCountArgs} args - Arguments to filter Quotations to count.
     * @example
     * // Count the number of Quotations
     * const count = await prisma.quotation.count({
     *   where: {
     *     // ... the filter for the Quotations we want to count
     *   }
     * })
    **/
    count<T extends QuotationCountArgs>(
      args?: Subset<T, QuotationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotationAggregateArgs>(args: Subset<T, QuotationAggregateArgs>): Prisma.PrismaPromise<GetQuotationAggregateType<T>>

    /**
     * Group by Quotation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotationGroupByArgs['orderBy'] }
        : { orderBy?: QuotationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quotation model
   */
  readonly fields: QuotationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quotation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lineItems<T extends Quotation$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, Quotation$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quotation model
   */
  interface QuotationFieldRefs {
    readonly id: FieldRef<"Quotation", 'String'>
    readonly clientId: FieldRef<"Quotation", 'String'>
    readonly sequenceNumber: FieldRef<"Quotation", 'Int'>
    readonly quotationNo: FieldRef<"Quotation", 'String'>
    readonly date: FieldRef<"Quotation", 'DateTime'>
    readonly validUntil: FieldRef<"Quotation", 'DateTime'>
    readonly gstType: FieldRef<"Quotation", 'String'>
    readonly subTotal: FieldRef<"Quotation", 'Decimal'>
    readonly taxTotal: FieldRef<"Quotation", 'Decimal'>
    readonly grandTotal: FieldRef<"Quotation", 'Decimal'>
    readonly status: FieldRef<"Quotation", 'String'>
    readonly convertedInvoiceId: FieldRef<"Quotation", 'String'>
    readonly notes: FieldRef<"Quotation", 'String'>
    readonly createdAt: FieldRef<"Quotation", 'DateTime'>
    readonly updatedAt: FieldRef<"Quotation", 'DateTime'>
    readonly deletedAt: FieldRef<"Quotation", 'DateTime'>
    readonly createdById: FieldRef<"Quotation", 'String'>
    readonly billingAddress1: FieldRef<"Quotation", 'String'>
    readonly billingAddress2: FieldRef<"Quotation", 'String'>
    readonly billingGst: FieldRef<"Quotation", 'String'>
    readonly billingName: FieldRef<"Quotation", 'String'>
    readonly billingPhone: FieldRef<"Quotation", 'String'>
    readonly billingPinCode: FieldRef<"Quotation", 'String'>
    readonly billingState: FieldRef<"Quotation", 'String'>
    readonly shippingAddress1: FieldRef<"Quotation", 'String'>
    readonly shippingAddress2: FieldRef<"Quotation", 'String'>
    readonly shippingName: FieldRef<"Quotation", 'String'>
    readonly shippingPinCode: FieldRef<"Quotation", 'String'>
    readonly shippingSameAsBilling: FieldRef<"Quotation", 'Boolean'>
    readonly shippingState: FieldRef<"Quotation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Quotation findUnique
   */
  export type QuotationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation findUniqueOrThrow
   */
  export type QuotationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation findFirst
   */
  export type QuotationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotations.
     */
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation findFirstOrThrow
   */
  export type QuotationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotation to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quotations.
     */
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation findMany
   */
  export type QuotationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter, which Quotations to fetch.
     */
    where?: QuotationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quotations to fetch.
     */
    orderBy?: QuotationOrderByWithRelationInput | QuotationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quotations.
     */
    cursor?: QuotationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quotations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quotations.
     */
    skip?: number
    distinct?: QuotationScalarFieldEnum | QuotationScalarFieldEnum[]
  }

  /**
   * Quotation create
   */
  export type QuotationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The data needed to create a Quotation.
     */
    data: XOR<QuotationCreateInput, QuotationUncheckedCreateInput>
  }

  /**
   * Quotation createMany
   */
  export type QuotationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quotations.
     */
    data: QuotationCreateManyInput | QuotationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Quotation update
   */
  export type QuotationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The data needed to update a Quotation.
     */
    data: XOR<QuotationUpdateInput, QuotationUncheckedUpdateInput>
    /**
     * Choose, which Quotation to update.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation updateMany
   */
  export type QuotationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quotations.
     */
    data: XOR<QuotationUpdateManyMutationInput, QuotationUncheckedUpdateManyInput>
    /**
     * Filter which Quotations to update
     */
    where?: QuotationWhereInput
    /**
     * Limit how many Quotations to update.
     */
    limit?: number
  }

  /**
   * Quotation upsert
   */
  export type QuotationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * The filter to search for the Quotation to update in case it exists.
     */
    where: QuotationWhereUniqueInput
    /**
     * In case the Quotation found by the `where` argument doesn't exist, create a new Quotation with this data.
     */
    create: XOR<QuotationCreateInput, QuotationUncheckedCreateInput>
    /**
     * In case the Quotation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotationUpdateInput, QuotationUncheckedUpdateInput>
  }

  /**
   * Quotation delete
   */
  export type QuotationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
    /**
     * Filter which Quotation to delete.
     */
    where: QuotationWhereUniqueInput
  }

  /**
   * Quotation deleteMany
   */
  export type QuotationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quotations to delete
     */
    where?: QuotationWhereInput
    /**
     * Limit how many Quotations to delete.
     */
    limit?: number
  }

  /**
   * Quotation.lineItems
   */
  export type Quotation$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    cursor?: QuotationLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * Quotation without action
   */
  export type QuotationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quotation
     */
    select?: QuotationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quotation
     */
    omit?: QuotationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationInclude<ExtArgs> | null
  }


  /**
   * Model QuotationLineItem
   */

  export type AggregateQuotationLineItem = {
    _count: QuotationLineItemCountAggregateOutputType | null
    _avg: QuotationLineItemAvgAggregateOutputType | null
    _sum: QuotationLineItemSumAggregateOutputType | null
    _min: QuotationLineItemMinAggregateOutputType | null
    _max: QuotationLineItemMaxAggregateOutputType | null
  }

  export type QuotationLineItemAvgAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type QuotationLineItemSumAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type QuotationLineItemMinAggregateOutputType = {
    id: string | null
    quotationId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type QuotationLineItemMaxAggregateOutputType = {
    id: string | null
    quotationId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type QuotationLineItemCountAggregateOutputType = {
    id: number
    quotationId: number
    productId: number
    description: number
    hsn: number
    qty: number
    rate: number
    taxPercent: number
    taxAmount: number
    unit: number
    pkgCount: number
    pkgType: number
    totalAmount: number
    _all: number
  }


  export type QuotationLineItemAvgAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type QuotationLineItemSumAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type QuotationLineItemMinAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type QuotationLineItemMaxAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type QuotationLineItemCountAggregateInputType = {
    id?: true
    quotationId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
    _all?: true
  }

  export type QuotationLineItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuotationLineItem to aggregate.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuotationLineItems
    **/
    _count?: true | QuotationLineItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuotationLineItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuotationLineItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuotationLineItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuotationLineItemMaxAggregateInputType
  }

  export type GetQuotationLineItemAggregateType<T extends QuotationLineItemAggregateArgs> = {
        [P in keyof T & keyof AggregateQuotationLineItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuotationLineItem[P]>
      : GetScalarType<T[P], AggregateQuotationLineItem[P]>
  }




  export type QuotationLineItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuotationLineItemWhereInput
    orderBy?: QuotationLineItemOrderByWithAggregationInput | QuotationLineItemOrderByWithAggregationInput[]
    by: QuotationLineItemScalarFieldEnum[] | QuotationLineItemScalarFieldEnum
    having?: QuotationLineItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuotationLineItemCountAggregateInputType | true
    _avg?: QuotationLineItemAvgAggregateInputType
    _sum?: QuotationLineItemSumAggregateInputType
    _min?: QuotationLineItemMinAggregateInputType
    _max?: QuotationLineItemMaxAggregateInputType
  }

  export type QuotationLineItemGroupByOutputType = {
    id: string
    quotationId: string
    productId: string | null
    description: string
    hsn: string | null
    qty: Decimal
    rate: Decimal
    taxPercent: Decimal
    taxAmount: Decimal
    unit: string
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal
    _count: QuotationLineItemCountAggregateOutputType | null
    _avg: QuotationLineItemAvgAggregateOutputType | null
    _sum: QuotationLineItemSumAggregateOutputType | null
    _min: QuotationLineItemMinAggregateOutputType | null
    _max: QuotationLineItemMaxAggregateOutputType | null
  }

  type GetQuotationLineItemGroupByPayload<T extends QuotationLineItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuotationLineItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuotationLineItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuotationLineItemGroupByOutputType[P]>
            : GetScalarType<T[P], QuotationLineItemGroupByOutputType[P]>
        }
      >
    >


  export type QuotationLineItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | QuotationLineItem$productArgs<ExtArgs>
  }, ExtArgs["result"]["quotationLineItem"]>



  export type QuotationLineItemSelectScalar = {
    id?: boolean
    quotationId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
  }

  export type QuotationLineItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quotationId" | "productId" | "description" | "hsn" | "qty" | "rate" | "taxPercent" | "taxAmount" | "unit" | "pkgCount" | "pkgType" | "totalAmount", ExtArgs["result"]["quotationLineItem"]>
  export type QuotationLineItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quotation?: boolean | QuotationDefaultArgs<ExtArgs>
    product?: boolean | QuotationLineItem$productArgs<ExtArgs>
  }

  export type $QuotationLineItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuotationLineItem"
    objects: {
      quotation: Prisma.$QuotationPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      quotationId: string
      productId: string | null
      description: string
      hsn: string | null
      qty: Prisma.Decimal
      rate: Prisma.Decimal
      taxPercent: Prisma.Decimal
      taxAmount: Prisma.Decimal
      unit: string
      pkgCount: number | null
      pkgType: string | null
      totalAmount: Prisma.Decimal
    }, ExtArgs["result"]["quotationLineItem"]>
    composites: {}
  }

  type QuotationLineItemGetPayload<S extends boolean | null | undefined | QuotationLineItemDefaultArgs> = $Result.GetResult<Prisma.$QuotationLineItemPayload, S>

  type QuotationLineItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuotationLineItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuotationLineItemCountAggregateInputType | true
    }

  export interface QuotationLineItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuotationLineItem'], meta: { name: 'QuotationLineItem' } }
    /**
     * Find zero or one QuotationLineItem that matches the filter.
     * @param {QuotationLineItemFindUniqueArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuotationLineItemFindUniqueArgs>(args: SelectSubset<T, QuotationLineItemFindUniqueArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuotationLineItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuotationLineItemFindUniqueOrThrowArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuotationLineItemFindUniqueOrThrowArgs>(args: SelectSubset<T, QuotationLineItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuotationLineItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindFirstArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuotationLineItemFindFirstArgs>(args?: SelectSubset<T, QuotationLineItemFindFirstArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuotationLineItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindFirstOrThrowArgs} args - Arguments to find a QuotationLineItem
     * @example
     * // Get one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuotationLineItemFindFirstOrThrowArgs>(args?: SelectSubset<T, QuotationLineItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuotationLineItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuotationLineItems
     * const quotationLineItems = await prisma.quotationLineItem.findMany()
     * 
     * // Get first 10 QuotationLineItems
     * const quotationLineItems = await prisma.quotationLineItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quotationLineItemWithIdOnly = await prisma.quotationLineItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuotationLineItemFindManyArgs>(args?: SelectSubset<T, QuotationLineItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuotationLineItem.
     * @param {QuotationLineItemCreateArgs} args - Arguments to create a QuotationLineItem.
     * @example
     * // Create one QuotationLineItem
     * const QuotationLineItem = await prisma.quotationLineItem.create({
     *   data: {
     *     // ... data to create a QuotationLineItem
     *   }
     * })
     * 
     */
    create<T extends QuotationLineItemCreateArgs>(args: SelectSubset<T, QuotationLineItemCreateArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuotationLineItems.
     * @param {QuotationLineItemCreateManyArgs} args - Arguments to create many QuotationLineItems.
     * @example
     * // Create many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuotationLineItemCreateManyArgs>(args?: SelectSubset<T, QuotationLineItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a QuotationLineItem.
     * @param {QuotationLineItemDeleteArgs} args - Arguments to delete one QuotationLineItem.
     * @example
     * // Delete one QuotationLineItem
     * const QuotationLineItem = await prisma.quotationLineItem.delete({
     *   where: {
     *     // ... filter to delete one QuotationLineItem
     *   }
     * })
     * 
     */
    delete<T extends QuotationLineItemDeleteArgs>(args: SelectSubset<T, QuotationLineItemDeleteArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuotationLineItem.
     * @param {QuotationLineItemUpdateArgs} args - Arguments to update one QuotationLineItem.
     * @example
     * // Update one QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuotationLineItemUpdateArgs>(args: SelectSubset<T, QuotationLineItemUpdateArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuotationLineItems.
     * @param {QuotationLineItemDeleteManyArgs} args - Arguments to filter QuotationLineItems to delete.
     * @example
     * // Delete a few QuotationLineItems
     * const { count } = await prisma.quotationLineItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuotationLineItemDeleteManyArgs>(args?: SelectSubset<T, QuotationLineItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuotationLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuotationLineItems
     * const quotationLineItem = await prisma.quotationLineItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuotationLineItemUpdateManyArgs>(args: SelectSubset<T, QuotationLineItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuotationLineItem.
     * @param {QuotationLineItemUpsertArgs} args - Arguments to update or create a QuotationLineItem.
     * @example
     * // Update or create a QuotationLineItem
     * const quotationLineItem = await prisma.quotationLineItem.upsert({
     *   create: {
     *     // ... data to create a QuotationLineItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuotationLineItem we want to update
     *   }
     * })
     */
    upsert<T extends QuotationLineItemUpsertArgs>(args: SelectSubset<T, QuotationLineItemUpsertArgs<ExtArgs>>): Prisma__QuotationLineItemClient<$Result.GetResult<Prisma.$QuotationLineItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuotationLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemCountArgs} args - Arguments to filter QuotationLineItems to count.
     * @example
     * // Count the number of QuotationLineItems
     * const count = await prisma.quotationLineItem.count({
     *   where: {
     *     // ... the filter for the QuotationLineItems we want to count
     *   }
     * })
    **/
    count<T extends QuotationLineItemCountArgs>(
      args?: Subset<T, QuotationLineItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuotationLineItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuotationLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuotationLineItemAggregateArgs>(args: Subset<T, QuotationLineItemAggregateArgs>): Prisma.PrismaPromise<GetQuotationLineItemAggregateType<T>>

    /**
     * Group by QuotationLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuotationLineItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuotationLineItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuotationLineItemGroupByArgs['orderBy'] }
        : { orderBy?: QuotationLineItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuotationLineItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuotationLineItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuotationLineItem model
   */
  readonly fields: QuotationLineItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuotationLineItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuotationLineItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quotation<T extends QuotationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuotationDefaultArgs<ExtArgs>>): Prisma__QuotationClient<$Result.GetResult<Prisma.$QuotationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends QuotationLineItem$productArgs<ExtArgs> = {}>(args?: Subset<T, QuotationLineItem$productArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuotationLineItem model
   */
  interface QuotationLineItemFieldRefs {
    readonly id: FieldRef<"QuotationLineItem", 'String'>
    readonly quotationId: FieldRef<"QuotationLineItem", 'String'>
    readonly productId: FieldRef<"QuotationLineItem", 'String'>
    readonly description: FieldRef<"QuotationLineItem", 'String'>
    readonly hsn: FieldRef<"QuotationLineItem", 'String'>
    readonly qty: FieldRef<"QuotationLineItem", 'Decimal'>
    readonly rate: FieldRef<"QuotationLineItem", 'Decimal'>
    readonly taxPercent: FieldRef<"QuotationLineItem", 'Decimal'>
    readonly taxAmount: FieldRef<"QuotationLineItem", 'Decimal'>
    readonly unit: FieldRef<"QuotationLineItem", 'String'>
    readonly pkgCount: FieldRef<"QuotationLineItem", 'Int'>
    readonly pkgType: FieldRef<"QuotationLineItem", 'String'>
    readonly totalAmount: FieldRef<"QuotationLineItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * QuotationLineItem findUnique
   */
  export type QuotationLineItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem findUniqueOrThrow
   */
  export type QuotationLineItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem findFirst
   */
  export type QuotationLineItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuotationLineItems.
     */
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem findFirstOrThrow
   */
  export type QuotationLineItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItem to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuotationLineItems.
     */
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem findMany
   */
  export type QuotationLineItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter, which QuotationLineItems to fetch.
     */
    where?: QuotationLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuotationLineItems to fetch.
     */
    orderBy?: QuotationLineItemOrderByWithRelationInput | QuotationLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuotationLineItems.
     */
    cursor?: QuotationLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuotationLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuotationLineItems.
     */
    skip?: number
    distinct?: QuotationLineItemScalarFieldEnum | QuotationLineItemScalarFieldEnum[]
  }

  /**
   * QuotationLineItem create
   */
  export type QuotationLineItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The data needed to create a QuotationLineItem.
     */
    data: XOR<QuotationLineItemCreateInput, QuotationLineItemUncheckedCreateInput>
  }

  /**
   * QuotationLineItem createMany
   */
  export type QuotationLineItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuotationLineItems.
     */
    data: QuotationLineItemCreateManyInput | QuotationLineItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuotationLineItem update
   */
  export type QuotationLineItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The data needed to update a QuotationLineItem.
     */
    data: XOR<QuotationLineItemUpdateInput, QuotationLineItemUncheckedUpdateInput>
    /**
     * Choose, which QuotationLineItem to update.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem updateMany
   */
  export type QuotationLineItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuotationLineItems.
     */
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyInput>
    /**
     * Filter which QuotationLineItems to update
     */
    where?: QuotationLineItemWhereInput
    /**
     * Limit how many QuotationLineItems to update.
     */
    limit?: number
  }

  /**
   * QuotationLineItem upsert
   */
  export type QuotationLineItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * The filter to search for the QuotationLineItem to update in case it exists.
     */
    where: QuotationLineItemWhereUniqueInput
    /**
     * In case the QuotationLineItem found by the `where` argument doesn't exist, create a new QuotationLineItem with this data.
     */
    create: XOR<QuotationLineItemCreateInput, QuotationLineItemUncheckedCreateInput>
    /**
     * In case the QuotationLineItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuotationLineItemUpdateInput, QuotationLineItemUncheckedUpdateInput>
  }

  /**
   * QuotationLineItem delete
   */
  export type QuotationLineItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
    /**
     * Filter which QuotationLineItem to delete.
     */
    where: QuotationLineItemWhereUniqueInput
  }

  /**
   * QuotationLineItem deleteMany
   */
  export type QuotationLineItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuotationLineItems to delete
     */
    where?: QuotationLineItemWhereInput
    /**
     * Limit how many QuotationLineItems to delete.
     */
    limit?: number
  }

  /**
   * QuotationLineItem.product
   */
  export type QuotationLineItem$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
  }

  /**
   * QuotationLineItem without action
   */
  export type QuotationLineItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuotationLineItem
     */
    select?: QuotationLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuotationLineItem
     */
    omit?: QuotationLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuotationLineItemInclude<ExtArgs> | null
  }


  /**
   * Model CompanySetting
   */

  export type AggregateCompanySetting = {
    _count: CompanySettingCountAggregateOutputType | null
    _min: CompanySettingMinAggregateOutputType | null
    _max: CompanySettingMaxAggregateOutputType | null
  }

  export type CompanySettingMinAggregateOutputType = {
    id: string | null
    companyName: string | null
    gstin: string | null
    pan: string | null
    address1: string | null
    address2: string | null
    city: string | null
    state: string | null
    pincode: string | null
    phone: string | null
    email: string | null
    website: string | null
    bankName: string | null
    bankBranch: string | null
    bankAccountNo: string | null
    bankIfsc: string | null
    bankAccountName: string | null
    invoicePrefix: string | null
    quotationPrefix: string | null
    defaultGstType: string | null
    currency: string | null
    showPkgDetails: boolean | null
    updatedAt: Date | null
  }

  export type CompanySettingMaxAggregateOutputType = {
    id: string | null
    companyName: string | null
    gstin: string | null
    pan: string | null
    address1: string | null
    address2: string | null
    city: string | null
    state: string | null
    pincode: string | null
    phone: string | null
    email: string | null
    website: string | null
    bankName: string | null
    bankBranch: string | null
    bankAccountNo: string | null
    bankIfsc: string | null
    bankAccountName: string | null
    invoicePrefix: string | null
    quotationPrefix: string | null
    defaultGstType: string | null
    currency: string | null
    showPkgDetails: boolean | null
    updatedAt: Date | null
  }

  export type CompanySettingCountAggregateOutputType = {
    id: number
    companyName: number
    gstin: number
    pan: number
    address1: number
    address2: number
    city: number
    state: number
    pincode: number
    phone: number
    email: number
    website: number
    bankName: number
    bankBranch: number
    bankAccountNo: number
    bankIfsc: number
    bankAccountName: number
    invoicePrefix: number
    quotationPrefix: number
    defaultGstType: number
    currency: number
    showPkgDetails: number
    updatedAt: number
    _all: number
  }


  export type CompanySettingMinAggregateInputType = {
    id?: true
    companyName?: true
    gstin?: true
    pan?: true
    address1?: true
    address2?: true
    city?: true
    state?: true
    pincode?: true
    phone?: true
    email?: true
    website?: true
    bankName?: true
    bankBranch?: true
    bankAccountNo?: true
    bankIfsc?: true
    bankAccountName?: true
    invoicePrefix?: true
    quotationPrefix?: true
    defaultGstType?: true
    currency?: true
    showPkgDetails?: true
    updatedAt?: true
  }

  export type CompanySettingMaxAggregateInputType = {
    id?: true
    companyName?: true
    gstin?: true
    pan?: true
    address1?: true
    address2?: true
    city?: true
    state?: true
    pincode?: true
    phone?: true
    email?: true
    website?: true
    bankName?: true
    bankBranch?: true
    bankAccountNo?: true
    bankIfsc?: true
    bankAccountName?: true
    invoicePrefix?: true
    quotationPrefix?: true
    defaultGstType?: true
    currency?: true
    showPkgDetails?: true
    updatedAt?: true
  }

  export type CompanySettingCountAggregateInputType = {
    id?: true
    companyName?: true
    gstin?: true
    pan?: true
    address1?: true
    address2?: true
    city?: true
    state?: true
    pincode?: true
    phone?: true
    email?: true
    website?: true
    bankName?: true
    bankBranch?: true
    bankAccountNo?: true
    bankIfsc?: true
    bankAccountName?: true
    invoicePrefix?: true
    quotationPrefix?: true
    defaultGstType?: true
    currency?: true
    showPkgDetails?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanySettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanySetting to aggregate.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompanySettings
    **/
    _count?: true | CompanySettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanySettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanySettingMaxAggregateInputType
  }

  export type GetCompanySettingAggregateType<T extends CompanySettingAggregateArgs> = {
        [P in keyof T & keyof AggregateCompanySetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanySetting[P]>
      : GetScalarType<T[P], AggregateCompanySetting[P]>
  }




  export type CompanySettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanySettingWhereInput
    orderBy?: CompanySettingOrderByWithAggregationInput | CompanySettingOrderByWithAggregationInput[]
    by: CompanySettingScalarFieldEnum[] | CompanySettingScalarFieldEnum
    having?: CompanySettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanySettingCountAggregateInputType | true
    _min?: CompanySettingMinAggregateInputType
    _max?: CompanySettingMaxAggregateInputType
  }

  export type CompanySettingGroupByOutputType = {
    id: string
    companyName: string
    gstin: string
    pan: string | null
    address1: string
    address2: string | null
    city: string
    state: string
    pincode: string
    phone: string
    email: string
    website: string | null
    bankName: string
    bankBranch: string
    bankAccountNo: string
    bankIfsc: string
    bankAccountName: string
    invoicePrefix: string
    quotationPrefix: string
    defaultGstType: string
    currency: string
    showPkgDetails: boolean
    updatedAt: Date
    _count: CompanySettingCountAggregateOutputType | null
    _min: CompanySettingMinAggregateOutputType | null
    _max: CompanySettingMaxAggregateOutputType | null
  }

  type GetCompanySettingGroupByPayload<T extends CompanySettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanySettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanySettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanySettingGroupByOutputType[P]>
            : GetScalarType<T[P], CompanySettingGroupByOutputType[P]>
        }
      >
    >


  export type CompanySettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    gstin?: boolean
    pan?: boolean
    address1?: boolean
    address2?: boolean
    city?: boolean
    state?: boolean
    pincode?: boolean
    phone?: boolean
    email?: boolean
    website?: boolean
    bankName?: boolean
    bankBranch?: boolean
    bankAccountNo?: boolean
    bankIfsc?: boolean
    bankAccountName?: boolean
    invoicePrefix?: boolean
    quotationPrefix?: boolean
    defaultGstType?: boolean
    currency?: boolean
    showPkgDetails?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["companySetting"]>



  export type CompanySettingSelectScalar = {
    id?: boolean
    companyName?: boolean
    gstin?: boolean
    pan?: boolean
    address1?: boolean
    address2?: boolean
    city?: boolean
    state?: boolean
    pincode?: boolean
    phone?: boolean
    email?: boolean
    website?: boolean
    bankName?: boolean
    bankBranch?: boolean
    bankAccountNo?: boolean
    bankIfsc?: boolean
    bankAccountName?: boolean
    invoicePrefix?: boolean
    quotationPrefix?: boolean
    defaultGstType?: boolean
    currency?: boolean
    showPkgDetails?: boolean
    updatedAt?: boolean
  }

  export type CompanySettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyName" | "gstin" | "pan" | "address1" | "address2" | "city" | "state" | "pincode" | "phone" | "email" | "website" | "bankName" | "bankBranch" | "bankAccountNo" | "bankIfsc" | "bankAccountName" | "invoicePrefix" | "quotationPrefix" | "defaultGstType" | "currency" | "showPkgDetails" | "updatedAt", ExtArgs["result"]["companySetting"]>

  export type $CompanySettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompanySetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyName: string
      gstin: string
      pan: string | null
      address1: string
      address2: string | null
      city: string
      state: string
      pincode: string
      phone: string
      email: string
      website: string | null
      bankName: string
      bankBranch: string
      bankAccountNo: string
      bankIfsc: string
      bankAccountName: string
      invoicePrefix: string
      quotationPrefix: string
      defaultGstType: string
      currency: string
      showPkgDetails: boolean
      updatedAt: Date
    }, ExtArgs["result"]["companySetting"]>
    composites: {}
  }

  type CompanySettingGetPayload<S extends boolean | null | undefined | CompanySettingDefaultArgs> = $Result.GetResult<Prisma.$CompanySettingPayload, S>

  type CompanySettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanySettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanySettingCountAggregateInputType | true
    }

  export interface CompanySettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompanySetting'], meta: { name: 'CompanySetting' } }
    /**
     * Find zero or one CompanySetting that matches the filter.
     * @param {CompanySettingFindUniqueArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanySettingFindUniqueArgs>(args: SelectSubset<T, CompanySettingFindUniqueArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompanySetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanySettingFindUniqueOrThrowArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanySettingFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanySettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanySetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindFirstArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanySettingFindFirstArgs>(args?: SelectSubset<T, CompanySettingFindFirstArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanySetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindFirstOrThrowArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanySettingFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanySettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompanySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompanySettings
     * const companySettings = await prisma.companySetting.findMany()
     * 
     * // Get first 10 CompanySettings
     * const companySettings = await prisma.companySetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companySettingWithIdOnly = await prisma.companySetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanySettingFindManyArgs>(args?: SelectSubset<T, CompanySettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompanySetting.
     * @param {CompanySettingCreateArgs} args - Arguments to create a CompanySetting.
     * @example
     * // Create one CompanySetting
     * const CompanySetting = await prisma.companySetting.create({
     *   data: {
     *     // ... data to create a CompanySetting
     *   }
     * })
     * 
     */
    create<T extends CompanySettingCreateArgs>(args: SelectSubset<T, CompanySettingCreateArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompanySettings.
     * @param {CompanySettingCreateManyArgs} args - Arguments to create many CompanySettings.
     * @example
     * // Create many CompanySettings
     * const companySetting = await prisma.companySetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanySettingCreateManyArgs>(args?: SelectSubset<T, CompanySettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CompanySetting.
     * @param {CompanySettingDeleteArgs} args - Arguments to delete one CompanySetting.
     * @example
     * // Delete one CompanySetting
     * const CompanySetting = await prisma.companySetting.delete({
     *   where: {
     *     // ... filter to delete one CompanySetting
     *   }
     * })
     * 
     */
    delete<T extends CompanySettingDeleteArgs>(args: SelectSubset<T, CompanySettingDeleteArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompanySetting.
     * @param {CompanySettingUpdateArgs} args - Arguments to update one CompanySetting.
     * @example
     * // Update one CompanySetting
     * const companySetting = await prisma.companySetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanySettingUpdateArgs>(args: SelectSubset<T, CompanySettingUpdateArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompanySettings.
     * @param {CompanySettingDeleteManyArgs} args - Arguments to filter CompanySettings to delete.
     * @example
     * // Delete a few CompanySettings
     * const { count } = await prisma.companySetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanySettingDeleteManyArgs>(args?: SelectSubset<T, CompanySettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompanySettings
     * const companySetting = await prisma.companySetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanySettingUpdateManyArgs>(args: SelectSubset<T, CompanySettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CompanySetting.
     * @param {CompanySettingUpsertArgs} args - Arguments to update or create a CompanySetting.
     * @example
     * // Update or create a CompanySetting
     * const companySetting = await prisma.companySetting.upsert({
     *   create: {
     *     // ... data to create a CompanySetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompanySetting we want to update
     *   }
     * })
     */
    upsert<T extends CompanySettingUpsertArgs>(args: SelectSubset<T, CompanySettingUpsertArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompanySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingCountArgs} args - Arguments to filter CompanySettings to count.
     * @example
     * // Count the number of CompanySettings
     * const count = await prisma.companySetting.count({
     *   where: {
     *     // ... the filter for the CompanySettings we want to count
     *   }
     * })
    **/
    count<T extends CompanySettingCountArgs>(
      args?: Subset<T, CompanySettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanySettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompanySetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanySettingAggregateArgs>(args: Subset<T, CompanySettingAggregateArgs>): Prisma.PrismaPromise<GetCompanySettingAggregateType<T>>

    /**
     * Group by CompanySetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanySettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanySettingGroupByArgs['orderBy'] }
        : { orderBy?: CompanySettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanySettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanySettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompanySetting model
   */
  readonly fields: CompanySettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompanySetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanySettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompanySetting model
   */
  interface CompanySettingFieldRefs {
    readonly id: FieldRef<"CompanySetting", 'String'>
    readonly companyName: FieldRef<"CompanySetting", 'String'>
    readonly gstin: FieldRef<"CompanySetting", 'String'>
    readonly pan: FieldRef<"CompanySetting", 'String'>
    readonly address1: FieldRef<"CompanySetting", 'String'>
    readonly address2: FieldRef<"CompanySetting", 'String'>
    readonly city: FieldRef<"CompanySetting", 'String'>
    readonly state: FieldRef<"CompanySetting", 'String'>
    readonly pincode: FieldRef<"CompanySetting", 'String'>
    readonly phone: FieldRef<"CompanySetting", 'String'>
    readonly email: FieldRef<"CompanySetting", 'String'>
    readonly website: FieldRef<"CompanySetting", 'String'>
    readonly bankName: FieldRef<"CompanySetting", 'String'>
    readonly bankBranch: FieldRef<"CompanySetting", 'String'>
    readonly bankAccountNo: FieldRef<"CompanySetting", 'String'>
    readonly bankIfsc: FieldRef<"CompanySetting", 'String'>
    readonly bankAccountName: FieldRef<"CompanySetting", 'String'>
    readonly invoicePrefix: FieldRef<"CompanySetting", 'String'>
    readonly quotationPrefix: FieldRef<"CompanySetting", 'String'>
    readonly defaultGstType: FieldRef<"CompanySetting", 'String'>
    readonly currency: FieldRef<"CompanySetting", 'String'>
    readonly showPkgDetails: FieldRef<"CompanySetting", 'Boolean'>
    readonly updatedAt: FieldRef<"CompanySetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompanySetting findUnique
   */
  export type CompanySettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting findUniqueOrThrow
   */
  export type CompanySettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting findFirst
   */
  export type CompanySettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanySettings.
     */
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting findFirstOrThrow
   */
  export type CompanySettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanySettings.
     */
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting findMany
   */
  export type CompanySettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter, which CompanySettings to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting create
   */
  export type CompanySettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * The data needed to create a CompanySetting.
     */
    data: XOR<CompanySettingCreateInput, CompanySettingUncheckedCreateInput>
  }

  /**
   * CompanySetting createMany
   */
  export type CompanySettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompanySettings.
     */
    data: CompanySettingCreateManyInput | CompanySettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompanySetting update
   */
  export type CompanySettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * The data needed to update a CompanySetting.
     */
    data: XOR<CompanySettingUpdateInput, CompanySettingUncheckedUpdateInput>
    /**
     * Choose, which CompanySetting to update.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting updateMany
   */
  export type CompanySettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompanySettings.
     */
    data: XOR<CompanySettingUpdateManyMutationInput, CompanySettingUncheckedUpdateManyInput>
    /**
     * Filter which CompanySettings to update
     */
    where?: CompanySettingWhereInput
    /**
     * Limit how many CompanySettings to update.
     */
    limit?: number
  }

  /**
   * CompanySetting upsert
   */
  export type CompanySettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * The filter to search for the CompanySetting to update in case it exists.
     */
    where: CompanySettingWhereUniqueInput
    /**
     * In case the CompanySetting found by the `where` argument doesn't exist, create a new CompanySetting with this data.
     */
    create: XOR<CompanySettingCreateInput, CompanySettingUncheckedCreateInput>
    /**
     * In case the CompanySetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanySettingUpdateInput, CompanySettingUncheckedUpdateInput>
  }

  /**
   * CompanySetting delete
   */
  export type CompanySettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
    /**
     * Filter which CompanySetting to delete.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting deleteMany
   */
  export type CompanySettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanySettings to delete
     */
    where?: CompanySettingWhereInput
    /**
     * Limit how many CompanySettings to delete.
     */
    limit?: number
  }

  /**
   * CompanySetting without action
   */
  export type CompanySettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanySetting
     */
    omit?: CompanySettingOmit<ExtArgs> | null
  }


  /**
   * Model InvoiceLineItem
   */

  export type AggregateInvoiceLineItem = {
    _count: InvoiceLineItemCountAggregateOutputType | null
    _avg: InvoiceLineItemAvgAggregateOutputType | null
    _sum: InvoiceLineItemSumAggregateOutputType | null
    _min: InvoiceLineItemMinAggregateOutputType | null
    _max: InvoiceLineItemMaxAggregateOutputType | null
  }

  export type InvoiceLineItemAvgAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type InvoiceLineItemSumAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type InvoiceLineItemMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type InvoiceLineItemMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type InvoiceLineItemCountAggregateOutputType = {
    id: number
    invoiceId: number
    productId: number
    description: number
    hsn: number
    qty: number
    rate: number
    taxPercent: number
    taxAmount: number
    unit: number
    pkgCount: number
    pkgType: number
    totalAmount: number
    _all: number
  }


  export type InvoiceLineItemAvgAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type InvoiceLineItemSumAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type InvoiceLineItemMinAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type InvoiceLineItemMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type InvoiceLineItemCountAggregateInputType = {
    id?: true
    invoiceId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
    _all?: true
  }

  export type InvoiceLineItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLineItem to aggregate.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceLineItems
    **/
    _count?: true | InvoiceLineItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceLineItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceLineItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceLineItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceLineItemMaxAggregateInputType
  }

  export type GetInvoiceLineItemAggregateType<T extends InvoiceLineItemAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceLineItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceLineItem[P]>
      : GetScalarType<T[P], AggregateInvoiceLineItem[P]>
  }




  export type InvoiceLineItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineItemWhereInput
    orderBy?: InvoiceLineItemOrderByWithAggregationInput | InvoiceLineItemOrderByWithAggregationInput[]
    by: InvoiceLineItemScalarFieldEnum[] | InvoiceLineItemScalarFieldEnum
    having?: InvoiceLineItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceLineItemCountAggregateInputType | true
    _avg?: InvoiceLineItemAvgAggregateInputType
    _sum?: InvoiceLineItemSumAggregateInputType
    _min?: InvoiceLineItemMinAggregateInputType
    _max?: InvoiceLineItemMaxAggregateInputType
  }

  export type InvoiceLineItemGroupByOutputType = {
    id: string
    invoiceId: string
    productId: string | null
    description: string
    hsn: string | null
    qty: Decimal
    rate: Decimal
    taxPercent: Decimal
    taxAmount: Decimal
    unit: string
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal
    _count: InvoiceLineItemCountAggregateOutputType | null
    _avg: InvoiceLineItemAvgAggregateOutputType | null
    _sum: InvoiceLineItemSumAggregateOutputType | null
    _min: InvoiceLineItemMinAggregateOutputType | null
    _max: InvoiceLineItemMaxAggregateOutputType | null
  }

  type GetInvoiceLineItemGroupByPayload<T extends InvoiceLineItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceLineItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceLineItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceLineItemGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceLineItemGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceLineItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    product?: boolean | InvoiceLineItem$productArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLineItem"]>



  export type InvoiceLineItemSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
  }

  export type InvoiceLineItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "productId" | "description" | "hsn" | "qty" | "rate" | "taxPercent" | "taxAmount" | "unit" | "pkgCount" | "pkgType" | "totalAmount", ExtArgs["result"]["invoiceLineItem"]>
  export type InvoiceLineItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    product?: boolean | InvoiceLineItem$productArgs<ExtArgs>
  }

  export type $InvoiceLineItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceLineItem"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      productId: string | null
      description: string
      hsn: string | null
      qty: Prisma.Decimal
      rate: Prisma.Decimal
      taxPercent: Prisma.Decimal
      taxAmount: Prisma.Decimal
      unit: string
      pkgCount: number | null
      pkgType: string | null
      totalAmount: Prisma.Decimal
    }, ExtArgs["result"]["invoiceLineItem"]>
    composites: {}
  }

  type InvoiceLineItemGetPayload<S extends boolean | null | undefined | InvoiceLineItemDefaultArgs> = $Result.GetResult<Prisma.$InvoiceLineItemPayload, S>

  type InvoiceLineItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceLineItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceLineItemCountAggregateInputType | true
    }

  export interface InvoiceLineItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceLineItem'], meta: { name: 'InvoiceLineItem' } }
    /**
     * Find zero or one InvoiceLineItem that matches the filter.
     * @param {InvoiceLineItemFindUniqueArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceLineItemFindUniqueArgs>(args: SelectSubset<T, InvoiceLineItemFindUniqueArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InvoiceLineItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceLineItemFindUniqueOrThrowArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceLineItemFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceLineItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindFirstArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceLineItemFindFirstArgs>(args?: SelectSubset<T, InvoiceLineItemFindFirstArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InvoiceLineItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindFirstOrThrowArgs} args - Arguments to find a InvoiceLineItem
     * @example
     * // Get one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceLineItemFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceLineItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InvoiceLineItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceLineItems
     * const invoiceLineItems = await prisma.invoiceLineItem.findMany()
     * 
     * // Get first 10 InvoiceLineItems
     * const invoiceLineItems = await prisma.invoiceLineItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceLineItemWithIdOnly = await prisma.invoiceLineItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceLineItemFindManyArgs>(args?: SelectSubset<T, InvoiceLineItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InvoiceLineItem.
     * @param {InvoiceLineItemCreateArgs} args - Arguments to create a InvoiceLineItem.
     * @example
     * // Create one InvoiceLineItem
     * const InvoiceLineItem = await prisma.invoiceLineItem.create({
     *   data: {
     *     // ... data to create a InvoiceLineItem
     *   }
     * })
     * 
     */
    create<T extends InvoiceLineItemCreateArgs>(args: SelectSubset<T, InvoiceLineItemCreateArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InvoiceLineItems.
     * @param {InvoiceLineItemCreateManyArgs} args - Arguments to create many InvoiceLineItems.
     * @example
     * // Create many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceLineItemCreateManyArgs>(args?: SelectSubset<T, InvoiceLineItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InvoiceLineItem.
     * @param {InvoiceLineItemDeleteArgs} args - Arguments to delete one InvoiceLineItem.
     * @example
     * // Delete one InvoiceLineItem
     * const InvoiceLineItem = await prisma.invoiceLineItem.delete({
     *   where: {
     *     // ... filter to delete one InvoiceLineItem
     *   }
     * })
     * 
     */
    delete<T extends InvoiceLineItemDeleteArgs>(args: SelectSubset<T, InvoiceLineItemDeleteArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InvoiceLineItem.
     * @param {InvoiceLineItemUpdateArgs} args - Arguments to update one InvoiceLineItem.
     * @example
     * // Update one InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceLineItemUpdateArgs>(args: SelectSubset<T, InvoiceLineItemUpdateArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InvoiceLineItems.
     * @param {InvoiceLineItemDeleteManyArgs} args - Arguments to filter InvoiceLineItems to delete.
     * @example
     * // Delete a few InvoiceLineItems
     * const { count } = await prisma.invoiceLineItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceLineItemDeleteManyArgs>(args?: SelectSubset<T, InvoiceLineItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceLineItems
     * const invoiceLineItem = await prisma.invoiceLineItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceLineItemUpdateManyArgs>(args: SelectSubset<T, InvoiceLineItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceLineItem.
     * @param {InvoiceLineItemUpsertArgs} args - Arguments to update or create a InvoiceLineItem.
     * @example
     * // Update or create a InvoiceLineItem
     * const invoiceLineItem = await prisma.invoiceLineItem.upsert({
     *   create: {
     *     // ... data to create a InvoiceLineItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceLineItem we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceLineItemUpsertArgs>(args: SelectSubset<T, InvoiceLineItemUpsertArgs<ExtArgs>>): Prisma__InvoiceLineItemClient<$Result.GetResult<Prisma.$InvoiceLineItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InvoiceLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemCountArgs} args - Arguments to filter InvoiceLineItems to count.
     * @example
     * // Count the number of InvoiceLineItems
     * const count = await prisma.invoiceLineItem.count({
     *   where: {
     *     // ... the filter for the InvoiceLineItems we want to count
     *   }
     * })
    **/
    count<T extends InvoiceLineItemCountArgs>(
      args?: Subset<T, InvoiceLineItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceLineItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceLineItemAggregateArgs>(args: Subset<T, InvoiceLineItemAggregateArgs>): Prisma.PrismaPromise<GetInvoiceLineItemAggregateType<T>>

    /**
     * Group by InvoiceLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceLineItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceLineItemGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceLineItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceLineItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceLineItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceLineItem model
   */
  readonly fields: InvoiceLineItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceLineItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceLineItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends InvoiceLineItem$productArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceLineItem$productArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceLineItem model
   */
  interface InvoiceLineItemFieldRefs {
    readonly id: FieldRef<"InvoiceLineItem", 'String'>
    readonly invoiceId: FieldRef<"InvoiceLineItem", 'String'>
    readonly productId: FieldRef<"InvoiceLineItem", 'String'>
    readonly description: FieldRef<"InvoiceLineItem", 'String'>
    readonly hsn: FieldRef<"InvoiceLineItem", 'String'>
    readonly qty: FieldRef<"InvoiceLineItem", 'Decimal'>
    readonly rate: FieldRef<"InvoiceLineItem", 'Decimal'>
    readonly taxPercent: FieldRef<"InvoiceLineItem", 'Decimal'>
    readonly taxAmount: FieldRef<"InvoiceLineItem", 'Decimal'>
    readonly unit: FieldRef<"InvoiceLineItem", 'String'>
    readonly pkgCount: FieldRef<"InvoiceLineItem", 'Int'>
    readonly pkgType: FieldRef<"InvoiceLineItem", 'String'>
    readonly totalAmount: FieldRef<"InvoiceLineItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceLineItem findUnique
   */
  export type InvoiceLineItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem findUniqueOrThrow
   */
  export type InvoiceLineItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem findFirst
   */
  export type InvoiceLineItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLineItems.
     */
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem findFirstOrThrow
   */
  export type InvoiceLineItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItem to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLineItems.
     */
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem findMany
   */
  export type InvoiceLineItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLineItems to fetch.
     */
    where?: InvoiceLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLineItems to fetch.
     */
    orderBy?: InvoiceLineItemOrderByWithRelationInput | InvoiceLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceLineItems.
     */
    cursor?: InvoiceLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLineItems.
     */
    skip?: number
    distinct?: InvoiceLineItemScalarFieldEnum | InvoiceLineItemScalarFieldEnum[]
  }

  /**
   * InvoiceLineItem create
   */
  export type InvoiceLineItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceLineItem.
     */
    data: XOR<InvoiceLineItemCreateInput, InvoiceLineItemUncheckedCreateInput>
  }

  /**
   * InvoiceLineItem createMany
   */
  export type InvoiceLineItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceLineItems.
     */
    data: InvoiceLineItemCreateManyInput | InvoiceLineItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvoiceLineItem update
   */
  export type InvoiceLineItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceLineItem.
     */
    data: XOR<InvoiceLineItemUpdateInput, InvoiceLineItemUncheckedUpdateInput>
    /**
     * Choose, which InvoiceLineItem to update.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem updateMany
   */
  export type InvoiceLineItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceLineItems.
     */
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceLineItems to update
     */
    where?: InvoiceLineItemWhereInput
    /**
     * Limit how many InvoiceLineItems to update.
     */
    limit?: number
  }

  /**
   * InvoiceLineItem upsert
   */
  export type InvoiceLineItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceLineItem to update in case it exists.
     */
    where: InvoiceLineItemWhereUniqueInput
    /**
     * In case the InvoiceLineItem found by the `where` argument doesn't exist, create a new InvoiceLineItem with this data.
     */
    create: XOR<InvoiceLineItemCreateInput, InvoiceLineItemUncheckedCreateInput>
    /**
     * In case the InvoiceLineItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceLineItemUpdateInput, InvoiceLineItemUncheckedUpdateInput>
  }

  /**
   * InvoiceLineItem delete
   */
  export type InvoiceLineItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
    /**
     * Filter which InvoiceLineItem to delete.
     */
    where: InvoiceLineItemWhereUniqueInput
  }

  /**
   * InvoiceLineItem deleteMany
   */
  export type InvoiceLineItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLineItems to delete
     */
    where?: InvoiceLineItemWhereInput
    /**
     * Limit how many InvoiceLineItems to delete.
     */
    limit?: number
  }

  /**
   * InvoiceLineItem.product
   */
  export type InvoiceLineItem$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
  }

  /**
   * InvoiceLineItem without action
   */
  export type InvoiceLineItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLineItem
     */
    select?: InvoiceLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InvoiceLineItem
     */
    omit?: InvoiceLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineItemInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    entityType: number
    entityId: number
    details: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entityType?: true
    entityId?: true
    details?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string | null
    action: string
    entityType: string
    entityId: string | null
    details: string | null
    ipAddress: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>



  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "entityType" | "entityId" | "details" | "ipAddress" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      action: string
      entityType: string
      entityId: string | null
      details: string | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorMinAggregateOutputType = {
    id: string | null
    name: string | null
    gst: string | null
    email: string | null
    phone: string | null
    address1: string | null
    address2: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean | null
  }

  export type VendorMaxAggregateOutputType = {
    id: string | null
    name: string | null
    gst: string | null
    email: string | null
    phone: string | null
    address1: string | null
    address2: string | null
    state: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    name: number
    gst: number
    email: number
    phone: number
    address1: number
    address2: number
    state: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    createdById: number
    updatedById: number
    pinCode: number
    active: number
    _all: number
  }


  export type VendorMinAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    name?: true
    gst?: true
    email?: true
    phone?: true
    address1?: true
    address2?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    updatedById?: true
    pinCode?: true
    active?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: string
    name: string
    gst: string | null
    email: string | null
    phone: string | null
    address1: string
    address2: string | null
    state: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    createdById: string | null
    updatedById: string | null
    pinCode: string | null
    active: boolean
    _count: VendorCountAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gst?: boolean
    email?: boolean
    phone?: boolean
    address1?: boolean
    address2?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    pinCode?: boolean
    active?: boolean
    purchases?: boolean | Vendor$purchasesArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>



  export type VendorSelectScalar = {
    id?: boolean
    name?: boolean
    gst?: boolean
    email?: boolean
    phone?: boolean
    address1?: boolean
    address2?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    pinCode?: boolean
    active?: boolean
  }

  export type VendorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "gst" | "email" | "phone" | "address1" | "address2" | "state" | "createdAt" | "updatedAt" | "deletedAt" | "createdById" | "updatedById" | "pinCode" | "active", ExtArgs["result"]["vendor"]>
  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchases?: boolean | Vendor$purchasesArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      purchases: Prisma.$PurchasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      gst: string | null
      email: string | null
      phone: string | null
      address1: string
      address2: string | null
      state: string
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      createdById: string | null
      updatedById: string | null
      pinCode: string | null
      active: boolean
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchases<T extends Vendor$purchasesArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$purchasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'String'>
    readonly name: FieldRef<"Vendor", 'String'>
    readonly gst: FieldRef<"Vendor", 'String'>
    readonly email: FieldRef<"Vendor", 'String'>
    readonly phone: FieldRef<"Vendor", 'String'>
    readonly address1: FieldRef<"Vendor", 'String'>
    readonly address2: FieldRef<"Vendor", 'String'>
    readonly state: FieldRef<"Vendor", 'String'>
    readonly createdAt: FieldRef<"Vendor", 'DateTime'>
    readonly updatedAt: FieldRef<"Vendor", 'DateTime'>
    readonly deletedAt: FieldRef<"Vendor", 'DateTime'>
    readonly createdById: FieldRef<"Vendor", 'String'>
    readonly updatedById: FieldRef<"Vendor", 'String'>
    readonly pinCode: FieldRef<"Vendor", 'String'>
    readonly active: FieldRef<"Vendor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to delete.
     */
    limit?: number
  }

  /**
   * Vendor.purchases
   */
  export type Vendor$purchasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    cursor?: PurchaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model Purchase
   */

  export type AggregatePurchase = {
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  export type PurchaseAvgAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
  }

  export type PurchaseSumAggregateOutputType = {
    sequenceNumber: number | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
  }

  export type PurchaseMinAggregateOutputType = {
    id: string | null
    vendorId: string | null
    sequenceNumber: number | null
    purchaseNo: string | null
    date: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
    status: string | null
    ewayBill: string | null
    ewayBillUrl: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
  }

  export type PurchaseMaxAggregateOutputType = {
    id: string | null
    vendorId: string | null
    sequenceNumber: number | null
    purchaseNo: string | null
    date: Date | null
    gstType: string | null
    subTotal: Decimal | null
    taxTotal: Decimal | null
    grandTotal: Decimal | null
    amountPaid: Decimal | null
    status: string | null
    ewayBill: string | null
    ewayBillUrl: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
  }

  export type PurchaseCountAggregateOutputType = {
    id: number
    vendorId: number
    sequenceNumber: number
    purchaseNo: number
    date: number
    gstType: number
    subTotal: number
    taxTotal: number
    grandTotal: number
    amountPaid: number
    status: number
    ewayBill: number
    ewayBillUrl: number
    vehicleNo: number
    dispatchedThrough: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    createdById: number
    notes: number
    _all: number
  }


  export type PurchaseAvgAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
  }

  export type PurchaseSumAggregateInputType = {
    sequenceNumber?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
  }

  export type PurchaseMinAggregateInputType = {
    id?: true
    vendorId?: true
    sequenceNumber?: true
    purchaseNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    ewayBillUrl?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
  }

  export type PurchaseMaxAggregateInputType = {
    id?: true
    vendorId?: true
    sequenceNumber?: true
    purchaseNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    ewayBillUrl?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
  }

  export type PurchaseCountAggregateInputType = {
    id?: true
    vendorId?: true
    sequenceNumber?: true
    purchaseNo?: true
    date?: true
    gstType?: true
    subTotal?: true
    taxTotal?: true
    grandTotal?: true
    amountPaid?: true
    status?: true
    ewayBill?: true
    ewayBillUrl?: true
    vehicleNo?: true
    dispatchedThrough?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    createdById?: true
    notes?: true
    _all?: true
  }

  export type PurchaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchase to aggregate.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Purchases
    **/
    _count?: true | PurchaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseMaxAggregateInputType
  }

  export type GetPurchaseAggregateType<T extends PurchaseAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchase[P]>
      : GetScalarType<T[P], AggregatePurchase[P]>
  }




  export type PurchaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseWhereInput
    orderBy?: PurchaseOrderByWithAggregationInput | PurchaseOrderByWithAggregationInput[]
    by: PurchaseScalarFieldEnum[] | PurchaseScalarFieldEnum
    having?: PurchaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseCountAggregateInputType | true
    _avg?: PurchaseAvgAggregateInputType
    _sum?: PurchaseSumAggregateInputType
    _min?: PurchaseMinAggregateInputType
    _max?: PurchaseMaxAggregateInputType
  }

  export type PurchaseGroupByOutputType = {
    id: string
    vendorId: string
    sequenceNumber: number
    purchaseNo: string
    date: Date
    gstType: string
    subTotal: Decimal
    taxTotal: Decimal
    grandTotal: Decimal
    amountPaid: Decimal
    status: string
    ewayBill: string | null
    ewayBillUrl: string | null
    vehicleNo: string | null
    dispatchedThrough: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    createdById: string | null
    notes: string | null
    _count: PurchaseCountAggregateOutputType | null
    _avg: PurchaseAvgAggregateOutputType | null
    _sum: PurchaseSumAggregateOutputType | null
    _min: PurchaseMinAggregateOutputType | null
    _max: PurchaseMaxAggregateOutputType | null
  }

  type GetPurchaseGroupByPayload<T extends PurchaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vendorId?: boolean
    sequenceNumber?: boolean
    purchaseNo?: boolean
    date?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    amountPaid?: boolean
    status?: boolean
    ewayBill?: boolean
    ewayBillUrl?: boolean
    vehicleNo?: boolean
    dispatchedThrough?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    notes?: boolean
    lineItems?: boolean | Purchase$lineItemsArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    _count?: boolean | PurchaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["purchase"]>



  export type PurchaseSelectScalar = {
    id?: boolean
    vendorId?: boolean
    sequenceNumber?: boolean
    purchaseNo?: boolean
    date?: boolean
    gstType?: boolean
    subTotal?: boolean
    taxTotal?: boolean
    grandTotal?: boolean
    amountPaid?: boolean
    status?: boolean
    ewayBill?: boolean
    ewayBillUrl?: boolean
    vehicleNo?: boolean
    dispatchedThrough?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    createdById?: boolean
    notes?: boolean
  }

  export type PurchaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vendorId" | "sequenceNumber" | "purchaseNo" | "date" | "gstType" | "subTotal" | "taxTotal" | "grandTotal" | "amountPaid" | "status" | "ewayBill" | "ewayBillUrl" | "vehicleNo" | "dispatchedThrough" | "createdAt" | "updatedAt" | "deletedAt" | "createdById" | "notes", ExtArgs["result"]["purchase"]>
  export type PurchaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lineItems?: boolean | Purchase$lineItemsArgs<ExtArgs>
    vendor?: boolean | VendorDefaultArgs<ExtArgs>
    _count?: boolean | PurchaseCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PurchasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Purchase"
    objects: {
      lineItems: Prisma.$PurchaseLineItemPayload<ExtArgs>[]
      vendor: Prisma.$VendorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vendorId: string
      sequenceNumber: number
      purchaseNo: string
      date: Date
      gstType: string
      subTotal: Prisma.Decimal
      taxTotal: Prisma.Decimal
      grandTotal: Prisma.Decimal
      amountPaid: Prisma.Decimal
      status: string
      ewayBill: string | null
      ewayBillUrl: string | null
      vehicleNo: string | null
      dispatchedThrough: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      createdById: string | null
      notes: string | null
    }, ExtArgs["result"]["purchase"]>
    composites: {}
  }

  type PurchaseGetPayload<S extends boolean | null | undefined | PurchaseDefaultArgs> = $Result.GetResult<Prisma.$PurchasePayload, S>

  type PurchaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseCountAggregateInputType | true
    }

  export interface PurchaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Purchase'], meta: { name: 'Purchase' } }
    /**
     * Find zero or one Purchase that matches the filter.
     * @param {PurchaseFindUniqueArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseFindUniqueArgs>(args: SelectSubset<T, PurchaseFindUniqueArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Purchase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseFindUniqueOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Purchase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseFindFirstArgs>(args?: SelectSubset<T, PurchaseFindFirstArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Purchase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindFirstOrThrowArgs} args - Arguments to find a Purchase
     * @example
     * // Get one Purchase
     * const purchase = await prisma.purchase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Purchases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Purchases
     * const purchases = await prisma.purchase.findMany()
     * 
     * // Get first 10 Purchases
     * const purchases = await prisma.purchase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseWithIdOnly = await prisma.purchase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseFindManyArgs>(args?: SelectSubset<T, PurchaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Purchase.
     * @param {PurchaseCreateArgs} args - Arguments to create a Purchase.
     * @example
     * // Create one Purchase
     * const Purchase = await prisma.purchase.create({
     *   data: {
     *     // ... data to create a Purchase
     *   }
     * })
     * 
     */
    create<T extends PurchaseCreateArgs>(args: SelectSubset<T, PurchaseCreateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Purchases.
     * @param {PurchaseCreateManyArgs} args - Arguments to create many Purchases.
     * @example
     * // Create many Purchases
     * const purchase = await prisma.purchase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseCreateManyArgs>(args?: SelectSubset<T, PurchaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Purchase.
     * @param {PurchaseDeleteArgs} args - Arguments to delete one Purchase.
     * @example
     * // Delete one Purchase
     * const Purchase = await prisma.purchase.delete({
     *   where: {
     *     // ... filter to delete one Purchase
     *   }
     * })
     * 
     */
    delete<T extends PurchaseDeleteArgs>(args: SelectSubset<T, PurchaseDeleteArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Purchase.
     * @param {PurchaseUpdateArgs} args - Arguments to update one Purchase.
     * @example
     * // Update one Purchase
     * const purchase = await prisma.purchase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseUpdateArgs>(args: SelectSubset<T, PurchaseUpdateArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Purchases.
     * @param {PurchaseDeleteManyArgs} args - Arguments to filter Purchases to delete.
     * @example
     * // Delete a few Purchases
     * const { count } = await prisma.purchase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseDeleteManyArgs>(args?: SelectSubset<T, PurchaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Purchases
     * const purchase = await prisma.purchase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseUpdateManyArgs>(args: SelectSubset<T, PurchaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Purchase.
     * @param {PurchaseUpsertArgs} args - Arguments to update or create a Purchase.
     * @example
     * // Update or create a Purchase
     * const purchase = await prisma.purchase.upsert({
     *   create: {
     *     // ... data to create a Purchase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Purchase we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseUpsertArgs>(args: SelectSubset<T, PurchaseUpsertArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Purchases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseCountArgs} args - Arguments to filter Purchases to count.
     * @example
     * // Count the number of Purchases
     * const count = await prisma.purchase.count({
     *   where: {
     *     // ... the filter for the Purchases we want to count
     *   }
     * })
    **/
    count<T extends PurchaseCountArgs>(
      args?: Subset<T, PurchaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseAggregateArgs>(args: Subset<T, PurchaseAggregateArgs>): Prisma.PrismaPromise<GetPurchaseAggregateType<T>>

    /**
     * Group by Purchase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Purchase model
   */
  readonly fields: PurchaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Purchase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lineItems<T extends Purchase$lineItemsArgs<ExtArgs> = {}>(args?: Subset<T, Purchase$lineItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VendorDefaultArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Purchase model
   */
  interface PurchaseFieldRefs {
    readonly id: FieldRef<"Purchase", 'String'>
    readonly vendorId: FieldRef<"Purchase", 'String'>
    readonly sequenceNumber: FieldRef<"Purchase", 'Int'>
    readonly purchaseNo: FieldRef<"Purchase", 'String'>
    readonly date: FieldRef<"Purchase", 'DateTime'>
    readonly gstType: FieldRef<"Purchase", 'String'>
    readonly subTotal: FieldRef<"Purchase", 'Decimal'>
    readonly taxTotal: FieldRef<"Purchase", 'Decimal'>
    readonly grandTotal: FieldRef<"Purchase", 'Decimal'>
    readonly amountPaid: FieldRef<"Purchase", 'Decimal'>
    readonly status: FieldRef<"Purchase", 'String'>
    readonly ewayBill: FieldRef<"Purchase", 'String'>
    readonly ewayBillUrl: FieldRef<"Purchase", 'String'>
    readonly vehicleNo: FieldRef<"Purchase", 'String'>
    readonly dispatchedThrough: FieldRef<"Purchase", 'String'>
    readonly createdAt: FieldRef<"Purchase", 'DateTime'>
    readonly updatedAt: FieldRef<"Purchase", 'DateTime'>
    readonly deletedAt: FieldRef<"Purchase", 'DateTime'>
    readonly createdById: FieldRef<"Purchase", 'String'>
    readonly notes: FieldRef<"Purchase", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Purchase findUnique
   */
  export type PurchaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findUniqueOrThrow
   */
  export type PurchaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase findFirst
   */
  export type PurchaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findFirstOrThrow
   */
  export type PurchaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchase to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Purchases.
     */
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase findMany
   */
  export type PurchaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter, which Purchases to fetch.
     */
    where?: PurchaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Purchases to fetch.
     */
    orderBy?: PurchaseOrderByWithRelationInput | PurchaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Purchases.
     */
    cursor?: PurchaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Purchases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Purchases.
     */
    skip?: number
    distinct?: PurchaseScalarFieldEnum | PurchaseScalarFieldEnum[]
  }

  /**
   * Purchase create
   */
  export type PurchaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Purchase.
     */
    data: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
  }

  /**
   * Purchase createMany
   */
  export type PurchaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Purchases.
     */
    data: PurchaseCreateManyInput | PurchaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Purchase update
   */
  export type PurchaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Purchase.
     */
    data: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
    /**
     * Choose, which Purchase to update.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase updateMany
   */
  export type PurchaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Purchases.
     */
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyInput>
    /**
     * Filter which Purchases to update
     */
    where?: PurchaseWhereInput
    /**
     * Limit how many Purchases to update.
     */
    limit?: number
  }

  /**
   * Purchase upsert
   */
  export type PurchaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Purchase to update in case it exists.
     */
    where: PurchaseWhereUniqueInput
    /**
     * In case the Purchase found by the `where` argument doesn't exist, create a new Purchase with this data.
     */
    create: XOR<PurchaseCreateInput, PurchaseUncheckedCreateInput>
    /**
     * In case the Purchase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseUpdateInput, PurchaseUncheckedUpdateInput>
  }

  /**
   * Purchase delete
   */
  export type PurchaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
    /**
     * Filter which Purchase to delete.
     */
    where: PurchaseWhereUniqueInput
  }

  /**
   * Purchase deleteMany
   */
  export type PurchaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Purchases to delete
     */
    where?: PurchaseWhereInput
    /**
     * Limit how many Purchases to delete.
     */
    limit?: number
  }

  /**
   * Purchase.lineItems
   */
  export type Purchase$lineItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    where?: PurchaseLineItemWhereInput
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    cursor?: PurchaseLineItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PurchaseLineItemScalarFieldEnum | PurchaseLineItemScalarFieldEnum[]
  }

  /**
   * Purchase without action
   */
  export type PurchaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Purchase
     */
    select?: PurchaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Purchase
     */
    omit?: PurchaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseLineItem
   */

  export type AggregatePurchaseLineItem = {
    _count: PurchaseLineItemCountAggregateOutputType | null
    _avg: PurchaseLineItemAvgAggregateOutputType | null
    _sum: PurchaseLineItemSumAggregateOutputType | null
    _min: PurchaseLineItemMinAggregateOutputType | null
    _max: PurchaseLineItemMaxAggregateOutputType | null
  }

  export type PurchaseLineItemAvgAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type PurchaseLineItemSumAggregateOutputType = {
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    pkgCount: number | null
    totalAmount: Decimal | null
  }

  export type PurchaseLineItemMinAggregateOutputType = {
    id: string | null
    purchaseId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type PurchaseLineItemMaxAggregateOutputType = {
    id: string | null
    purchaseId: string | null
    productId: string | null
    description: string | null
    hsn: string | null
    qty: Decimal | null
    rate: Decimal | null
    taxPercent: Decimal | null
    taxAmount: Decimal | null
    unit: string | null
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal | null
  }

  export type PurchaseLineItemCountAggregateOutputType = {
    id: number
    purchaseId: number
    productId: number
    description: number
    hsn: number
    qty: number
    rate: number
    taxPercent: number
    taxAmount: number
    unit: number
    pkgCount: number
    pkgType: number
    totalAmount: number
    _all: number
  }


  export type PurchaseLineItemAvgAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type PurchaseLineItemSumAggregateInputType = {
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    pkgCount?: true
    totalAmount?: true
  }

  export type PurchaseLineItemMinAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type PurchaseLineItemMaxAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
  }

  export type PurchaseLineItemCountAggregateInputType = {
    id?: true
    purchaseId?: true
    productId?: true
    description?: true
    hsn?: true
    qty?: true
    rate?: true
    taxPercent?: true
    taxAmount?: true
    unit?: true
    pkgCount?: true
    pkgType?: true
    totalAmount?: true
    _all?: true
  }

  export type PurchaseLineItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseLineItem to aggregate.
     */
    where?: PurchaseLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseLineItems to fetch.
     */
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseLineItems
    **/
    _count?: true | PurchaseLineItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchaseLineItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchaseLineItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseLineItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseLineItemMaxAggregateInputType
  }

  export type GetPurchaseLineItemAggregateType<T extends PurchaseLineItemAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseLineItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseLineItem[P]>
      : GetScalarType<T[P], AggregatePurchaseLineItem[P]>
  }




  export type PurchaseLineItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseLineItemWhereInput
    orderBy?: PurchaseLineItemOrderByWithAggregationInput | PurchaseLineItemOrderByWithAggregationInput[]
    by: PurchaseLineItemScalarFieldEnum[] | PurchaseLineItemScalarFieldEnum
    having?: PurchaseLineItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseLineItemCountAggregateInputType | true
    _avg?: PurchaseLineItemAvgAggregateInputType
    _sum?: PurchaseLineItemSumAggregateInputType
    _min?: PurchaseLineItemMinAggregateInputType
    _max?: PurchaseLineItemMaxAggregateInputType
  }

  export type PurchaseLineItemGroupByOutputType = {
    id: string
    purchaseId: string
    productId: string | null
    description: string
    hsn: string | null
    qty: Decimal
    rate: Decimal
    taxPercent: Decimal
    taxAmount: Decimal
    unit: string
    pkgCount: number | null
    pkgType: string | null
    totalAmount: Decimal
    _count: PurchaseLineItemCountAggregateOutputType | null
    _avg: PurchaseLineItemAvgAggregateOutputType | null
    _sum: PurchaseLineItemSumAggregateOutputType | null
    _min: PurchaseLineItemMinAggregateOutputType | null
    _max: PurchaseLineItemMaxAggregateOutputType | null
  }

  type GetPurchaseLineItemGroupByPayload<T extends PurchaseLineItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseLineItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseLineItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseLineItemGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseLineItemGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseLineItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    purchaseId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
    purchase?: boolean | PurchaseDefaultArgs<ExtArgs>
    product?: boolean | PurchaseLineItem$productArgs<ExtArgs>
  }, ExtArgs["result"]["purchaseLineItem"]>



  export type PurchaseLineItemSelectScalar = {
    id?: boolean
    purchaseId?: boolean
    productId?: boolean
    description?: boolean
    hsn?: boolean
    qty?: boolean
    rate?: boolean
    taxPercent?: boolean
    taxAmount?: boolean
    unit?: boolean
    pkgCount?: boolean
    pkgType?: boolean
    totalAmount?: boolean
  }

  export type PurchaseLineItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "purchaseId" | "productId" | "description" | "hsn" | "qty" | "rate" | "taxPercent" | "taxAmount" | "unit" | "pkgCount" | "pkgType" | "totalAmount", ExtArgs["result"]["purchaseLineItem"]>
  export type PurchaseLineItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    purchase?: boolean | PurchaseDefaultArgs<ExtArgs>
    product?: boolean | PurchaseLineItem$productArgs<ExtArgs>
  }

  export type $PurchaseLineItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseLineItem"
    objects: {
      purchase: Prisma.$PurchasePayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      purchaseId: string
      productId: string | null
      description: string
      hsn: string | null
      qty: Prisma.Decimal
      rate: Prisma.Decimal
      taxPercent: Prisma.Decimal
      taxAmount: Prisma.Decimal
      unit: string
      pkgCount: number | null
      pkgType: string | null
      totalAmount: Prisma.Decimal
    }, ExtArgs["result"]["purchaseLineItem"]>
    composites: {}
  }

  type PurchaseLineItemGetPayload<S extends boolean | null | undefined | PurchaseLineItemDefaultArgs> = $Result.GetResult<Prisma.$PurchaseLineItemPayload, S>

  type PurchaseLineItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseLineItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseLineItemCountAggregateInputType | true
    }

  export interface PurchaseLineItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseLineItem'], meta: { name: 'PurchaseLineItem' } }
    /**
     * Find zero or one PurchaseLineItem that matches the filter.
     * @param {PurchaseLineItemFindUniqueArgs} args - Arguments to find a PurchaseLineItem
     * @example
     * // Get one PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseLineItemFindUniqueArgs>(args: SelectSubset<T, PurchaseLineItemFindUniqueArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseLineItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseLineItemFindUniqueOrThrowArgs} args - Arguments to find a PurchaseLineItem
     * @example
     * // Get one PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseLineItemFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseLineItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseLineItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemFindFirstArgs} args - Arguments to find a PurchaseLineItem
     * @example
     * // Get one PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseLineItemFindFirstArgs>(args?: SelectSubset<T, PurchaseLineItemFindFirstArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseLineItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemFindFirstOrThrowArgs} args - Arguments to find a PurchaseLineItem
     * @example
     * // Get one PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseLineItemFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseLineItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseLineItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseLineItems
     * const purchaseLineItems = await prisma.purchaseLineItem.findMany()
     * 
     * // Get first 10 PurchaseLineItems
     * const purchaseLineItems = await prisma.purchaseLineItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchaseLineItemWithIdOnly = await prisma.purchaseLineItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchaseLineItemFindManyArgs>(args?: SelectSubset<T, PurchaseLineItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseLineItem.
     * @param {PurchaseLineItemCreateArgs} args - Arguments to create a PurchaseLineItem.
     * @example
     * // Create one PurchaseLineItem
     * const PurchaseLineItem = await prisma.purchaseLineItem.create({
     *   data: {
     *     // ... data to create a PurchaseLineItem
     *   }
     * })
     * 
     */
    create<T extends PurchaseLineItemCreateArgs>(args: SelectSubset<T, PurchaseLineItemCreateArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseLineItems.
     * @param {PurchaseLineItemCreateManyArgs} args - Arguments to create many PurchaseLineItems.
     * @example
     * // Create many PurchaseLineItems
     * const purchaseLineItem = await prisma.purchaseLineItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseLineItemCreateManyArgs>(args?: SelectSubset<T, PurchaseLineItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PurchaseLineItem.
     * @param {PurchaseLineItemDeleteArgs} args - Arguments to delete one PurchaseLineItem.
     * @example
     * // Delete one PurchaseLineItem
     * const PurchaseLineItem = await prisma.purchaseLineItem.delete({
     *   where: {
     *     // ... filter to delete one PurchaseLineItem
     *   }
     * })
     * 
     */
    delete<T extends PurchaseLineItemDeleteArgs>(args: SelectSubset<T, PurchaseLineItemDeleteArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseLineItem.
     * @param {PurchaseLineItemUpdateArgs} args - Arguments to update one PurchaseLineItem.
     * @example
     * // Update one PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseLineItemUpdateArgs>(args: SelectSubset<T, PurchaseLineItemUpdateArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseLineItems.
     * @param {PurchaseLineItemDeleteManyArgs} args - Arguments to filter PurchaseLineItems to delete.
     * @example
     * // Delete a few PurchaseLineItems
     * const { count } = await prisma.purchaseLineItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseLineItemDeleteManyArgs>(args?: SelectSubset<T, PurchaseLineItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseLineItems
     * const purchaseLineItem = await prisma.purchaseLineItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseLineItemUpdateManyArgs>(args: SelectSubset<T, PurchaseLineItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PurchaseLineItem.
     * @param {PurchaseLineItemUpsertArgs} args - Arguments to update or create a PurchaseLineItem.
     * @example
     * // Update or create a PurchaseLineItem
     * const purchaseLineItem = await prisma.purchaseLineItem.upsert({
     *   create: {
     *     // ... data to create a PurchaseLineItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseLineItem we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseLineItemUpsertArgs>(args: SelectSubset<T, PurchaseLineItemUpsertArgs<ExtArgs>>): Prisma__PurchaseLineItemClient<$Result.GetResult<Prisma.$PurchaseLineItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseLineItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemCountArgs} args - Arguments to filter PurchaseLineItems to count.
     * @example
     * // Count the number of PurchaseLineItems
     * const count = await prisma.purchaseLineItem.count({
     *   where: {
     *     // ... the filter for the PurchaseLineItems we want to count
     *   }
     * })
    **/
    count<T extends PurchaseLineItemCountArgs>(
      args?: Subset<T, PurchaseLineItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseLineItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseLineItemAggregateArgs>(args: Subset<T, PurchaseLineItemAggregateArgs>): Prisma.PrismaPromise<GetPurchaseLineItemAggregateType<T>>

    /**
     * Group by PurchaseLineItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseLineItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseLineItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseLineItemGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseLineItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseLineItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseLineItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseLineItem model
   */
  readonly fields: PurchaseLineItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseLineItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseLineItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    purchase<T extends PurchaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseDefaultArgs<ExtArgs>>): Prisma__PurchaseClient<$Result.GetResult<Prisma.$PurchasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends PurchaseLineItem$productArgs<ExtArgs> = {}>(args?: Subset<T, PurchaseLineItem$productArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseLineItem model
   */
  interface PurchaseLineItemFieldRefs {
    readonly id: FieldRef<"PurchaseLineItem", 'String'>
    readonly purchaseId: FieldRef<"PurchaseLineItem", 'String'>
    readonly productId: FieldRef<"PurchaseLineItem", 'String'>
    readonly description: FieldRef<"PurchaseLineItem", 'String'>
    readonly hsn: FieldRef<"PurchaseLineItem", 'String'>
    readonly qty: FieldRef<"PurchaseLineItem", 'Decimal'>
    readonly rate: FieldRef<"PurchaseLineItem", 'Decimal'>
    readonly taxPercent: FieldRef<"PurchaseLineItem", 'Decimal'>
    readonly taxAmount: FieldRef<"PurchaseLineItem", 'Decimal'>
    readonly unit: FieldRef<"PurchaseLineItem", 'String'>
    readonly pkgCount: FieldRef<"PurchaseLineItem", 'Int'>
    readonly pkgType: FieldRef<"PurchaseLineItem", 'String'>
    readonly totalAmount: FieldRef<"PurchaseLineItem", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseLineItem findUnique
   */
  export type PurchaseLineItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseLineItem to fetch.
     */
    where: PurchaseLineItemWhereUniqueInput
  }

  /**
   * PurchaseLineItem findUniqueOrThrow
   */
  export type PurchaseLineItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseLineItem to fetch.
     */
    where: PurchaseLineItemWhereUniqueInput
  }

  /**
   * PurchaseLineItem findFirst
   */
  export type PurchaseLineItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseLineItem to fetch.
     */
    where?: PurchaseLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseLineItems to fetch.
     */
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseLineItems.
     */
    cursor?: PurchaseLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseLineItems.
     */
    distinct?: PurchaseLineItemScalarFieldEnum | PurchaseLineItemScalarFieldEnum[]
  }

  /**
   * PurchaseLineItem findFirstOrThrow
   */
  export type PurchaseLineItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseLineItem to fetch.
     */
    where?: PurchaseLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseLineItems to fetch.
     */
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseLineItems.
     */
    cursor?: PurchaseLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseLineItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseLineItems.
     */
    distinct?: PurchaseLineItemScalarFieldEnum | PurchaseLineItemScalarFieldEnum[]
  }

  /**
   * PurchaseLineItem findMany
   */
  export type PurchaseLineItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter, which PurchaseLineItems to fetch.
     */
    where?: PurchaseLineItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseLineItems to fetch.
     */
    orderBy?: PurchaseLineItemOrderByWithRelationInput | PurchaseLineItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseLineItems.
     */
    cursor?: PurchaseLineItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseLineItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseLineItems.
     */
    skip?: number
    distinct?: PurchaseLineItemScalarFieldEnum | PurchaseLineItemScalarFieldEnum[]
  }

  /**
   * PurchaseLineItem create
   */
  export type PurchaseLineItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * The data needed to create a PurchaseLineItem.
     */
    data: XOR<PurchaseLineItemCreateInput, PurchaseLineItemUncheckedCreateInput>
  }

  /**
   * PurchaseLineItem createMany
   */
  export type PurchaseLineItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseLineItems.
     */
    data: PurchaseLineItemCreateManyInput | PurchaseLineItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseLineItem update
   */
  export type PurchaseLineItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * The data needed to update a PurchaseLineItem.
     */
    data: XOR<PurchaseLineItemUpdateInput, PurchaseLineItemUncheckedUpdateInput>
    /**
     * Choose, which PurchaseLineItem to update.
     */
    where: PurchaseLineItemWhereUniqueInput
  }

  /**
   * PurchaseLineItem updateMany
   */
  export type PurchaseLineItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseLineItems.
     */
    data: XOR<PurchaseLineItemUpdateManyMutationInput, PurchaseLineItemUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseLineItems to update
     */
    where?: PurchaseLineItemWhereInput
    /**
     * Limit how many PurchaseLineItems to update.
     */
    limit?: number
  }

  /**
   * PurchaseLineItem upsert
   */
  export type PurchaseLineItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * The filter to search for the PurchaseLineItem to update in case it exists.
     */
    where: PurchaseLineItemWhereUniqueInput
    /**
     * In case the PurchaseLineItem found by the `where` argument doesn't exist, create a new PurchaseLineItem with this data.
     */
    create: XOR<PurchaseLineItemCreateInput, PurchaseLineItemUncheckedCreateInput>
    /**
     * In case the PurchaseLineItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseLineItemUpdateInput, PurchaseLineItemUncheckedUpdateInput>
  }

  /**
   * PurchaseLineItem delete
   */
  export type PurchaseLineItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
    /**
     * Filter which PurchaseLineItem to delete.
     */
    where: PurchaseLineItemWhereUniqueInput
  }

  /**
   * PurchaseLineItem deleteMany
   */
  export type PurchaseLineItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseLineItems to delete
     */
    where?: PurchaseLineItemWhereInput
    /**
     * Limit how many PurchaseLineItems to delete.
     */
    limit?: number
  }

  /**
   * PurchaseLineItem.product
   */
  export type PurchaseLineItem$productArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
  }

  /**
   * PurchaseLineItem without action
   */
  export type PurchaseLineItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseLineItem
     */
    select?: PurchaseLineItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseLineItem
     */
    omit?: PurchaseLineItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PurchaseLineItemInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    lastLoginAt: 'lastLoginAt',
    lastLoginIp: 'lastLoginIp',
    failedLogins: 'failedLogins',
    isLockedOut: 'isLockedOut',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    gst: 'gst',
    email: 'email',
    phone: 'phone',
    address1: 'address1',
    address2: 'address2',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    createdById: 'createdById',
    updatedById: 'updatedById',
    pinCode: 'pinCode',
    active: 'active'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    sku: 'sku',
    description: 'description',
    hsn: 'hsn',
    gstRate: 'gstRate',
    unit: 'unit',
    notes: 'notes',
    pkgType: 'pkgType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    active: 'active',
    purchaseRate: 'purchaseRate',
    sellingRate: 'sellingRate'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    sequenceNumber: 'sequenceNumber',
    invoiceNo: 'invoiceNo',
    date: 'date',
    gstType: 'gstType',
    subTotal: 'subTotal',
    taxTotal: 'taxTotal',
    grandTotal: 'grandTotal',
    amountPaid: 'amountPaid',
    status: 'status',
    ewayBill: 'ewayBill',
    vehicleNo: 'vehicleNo',
    dispatchedThrough: 'dispatchedThrough',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    createdById: 'createdById',
    notes: 'notes',
    billingAddress1: 'billingAddress1',
    billingAddress2: 'billingAddress2',
    billingGst: 'billingGst',
    billingName: 'billingName',
    billingPhone: 'billingPhone',
    billingPinCode: 'billingPinCode',
    billingState: 'billingState',
    shippingAddress1: 'shippingAddress1',
    shippingAddress2: 'shippingAddress2',
    shippingName: 'shippingName',
    shippingPinCode: 'shippingPinCode',
    shippingSameAsBilling: 'shippingSameAsBilling',
    shippingState: 'shippingState',
    ewayBillUrl: 'ewayBillUrl'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    amount: 'amount',
    paidAt: 'paidAt',
    method: 'method',
    reference: 'reference',
    notes: 'notes',
    recordedBy: 'recordedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const QuotationScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    sequenceNumber: 'sequenceNumber',
    quotationNo: 'quotationNo',
    date: 'date',
    validUntil: 'validUntil',
    gstType: 'gstType',
    subTotal: 'subTotal',
    taxTotal: 'taxTotal',
    grandTotal: 'grandTotal',
    status: 'status',
    convertedInvoiceId: 'convertedInvoiceId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    createdById: 'createdById',
    billingAddress1: 'billingAddress1',
    billingAddress2: 'billingAddress2',
    billingGst: 'billingGst',
    billingName: 'billingName',
    billingPhone: 'billingPhone',
    billingPinCode: 'billingPinCode',
    billingState: 'billingState',
    shippingAddress1: 'shippingAddress1',
    shippingAddress2: 'shippingAddress2',
    shippingName: 'shippingName',
    shippingPinCode: 'shippingPinCode',
    shippingSameAsBilling: 'shippingSameAsBilling',
    shippingState: 'shippingState'
  };

  export type QuotationScalarFieldEnum = (typeof QuotationScalarFieldEnum)[keyof typeof QuotationScalarFieldEnum]


  export const QuotationLineItemScalarFieldEnum: {
    id: 'id',
    quotationId: 'quotationId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    qty: 'qty',
    rate: 'rate',
    taxPercent: 'taxPercent',
    taxAmount: 'taxAmount',
    unit: 'unit',
    pkgCount: 'pkgCount',
    pkgType: 'pkgType',
    totalAmount: 'totalAmount'
  };

  export type QuotationLineItemScalarFieldEnum = (typeof QuotationLineItemScalarFieldEnum)[keyof typeof QuotationLineItemScalarFieldEnum]


  export const CompanySettingScalarFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    gstin: 'gstin',
    pan: 'pan',
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    state: 'state',
    pincode: 'pincode',
    phone: 'phone',
    email: 'email',
    website: 'website',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    bankAccountNo: 'bankAccountNo',
    bankIfsc: 'bankIfsc',
    bankAccountName: 'bankAccountName',
    invoicePrefix: 'invoicePrefix',
    quotationPrefix: 'quotationPrefix',
    defaultGstType: 'defaultGstType',
    currency: 'currency',
    showPkgDetails: 'showPkgDetails',
    updatedAt: 'updatedAt'
  };

  export type CompanySettingScalarFieldEnum = (typeof CompanySettingScalarFieldEnum)[keyof typeof CompanySettingScalarFieldEnum]


  export const InvoiceLineItemScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    qty: 'qty',
    rate: 'rate',
    taxPercent: 'taxPercent',
    taxAmount: 'taxAmount',
    unit: 'unit',
    pkgCount: 'pkgCount',
    pkgType: 'pkgType',
    totalAmount: 'totalAmount'
  };

  export type InvoiceLineItemScalarFieldEnum = (typeof InvoiceLineItemScalarFieldEnum)[keyof typeof InvoiceLineItemScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    details: 'details',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const VendorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    gst: 'gst',
    email: 'email',
    phone: 'phone',
    address1: 'address1',
    address2: 'address2',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    createdById: 'createdById',
    updatedById: 'updatedById',
    pinCode: 'pinCode',
    active: 'active'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const PurchaseScalarFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    sequenceNumber: 'sequenceNumber',
    purchaseNo: 'purchaseNo',
    date: 'date',
    gstType: 'gstType',
    subTotal: 'subTotal',
    taxTotal: 'taxTotal',
    grandTotal: 'grandTotal',
    amountPaid: 'amountPaid',
    status: 'status',
    ewayBill: 'ewayBill',
    ewayBillUrl: 'ewayBillUrl',
    vehicleNo: 'vehicleNo',
    dispatchedThrough: 'dispatchedThrough',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    createdById: 'createdById',
    notes: 'notes'
  };

  export type PurchaseScalarFieldEnum = (typeof PurchaseScalarFieldEnum)[keyof typeof PurchaseScalarFieldEnum]


  export const PurchaseLineItemScalarFieldEnum: {
    id: 'id',
    purchaseId: 'purchaseId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    qty: 'qty',
    rate: 'rate',
    taxPercent: 'taxPercent',
    taxAmount: 'taxAmount',
    unit: 'unit',
    pkgCount: 'pkgCount',
    pkgType: 'pkgType',
    totalAmount: 'totalAmount'
  };

  export type PurchaseLineItemScalarFieldEnum = (typeof PurchaseLineItemScalarFieldEnum)[keyof typeof PurchaseLineItemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    lastLoginIp: 'lastLoginIp'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const ClientOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    gst: 'gst',
    email: 'email',
    phone: 'phone',
    address1: 'address1',
    address2: 'address2',
    state: 'state',
    createdById: 'createdById',
    updatedById: 'updatedById',
    pinCode: 'pinCode'
  };

  export type ClientOrderByRelevanceFieldEnum = (typeof ClientOrderByRelevanceFieldEnum)[keyof typeof ClientOrderByRelevanceFieldEnum]


  export const ProductOrderByRelevanceFieldEnum: {
    id: 'id',
    sku: 'sku',
    description: 'description',
    hsn: 'hsn',
    unit: 'unit',
    notes: 'notes',
    pkgType: 'pkgType'
  };

  export type ProductOrderByRelevanceFieldEnum = (typeof ProductOrderByRelevanceFieldEnum)[keyof typeof ProductOrderByRelevanceFieldEnum]


  export const InvoiceOrderByRelevanceFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    invoiceNo: 'invoiceNo',
    gstType: 'gstType',
    status: 'status',
    ewayBill: 'ewayBill',
    vehicleNo: 'vehicleNo',
    dispatchedThrough: 'dispatchedThrough',
    createdById: 'createdById',
    notes: 'notes',
    billingAddress1: 'billingAddress1',
    billingAddress2: 'billingAddress2',
    billingGst: 'billingGst',
    billingName: 'billingName',
    billingPhone: 'billingPhone',
    billingPinCode: 'billingPinCode',
    billingState: 'billingState',
    shippingAddress1: 'shippingAddress1',
    shippingAddress2: 'shippingAddress2',
    shippingName: 'shippingName',
    shippingPinCode: 'shippingPinCode',
    shippingState: 'shippingState',
    ewayBillUrl: 'ewayBillUrl'
  };

  export type InvoiceOrderByRelevanceFieldEnum = (typeof InvoiceOrderByRelevanceFieldEnum)[keyof typeof InvoiceOrderByRelevanceFieldEnum]


  export const PaymentOrderByRelevanceFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    method: 'method',
    reference: 'reference',
    notes: 'notes',
    recordedBy: 'recordedBy'
  };

  export type PaymentOrderByRelevanceFieldEnum = (typeof PaymentOrderByRelevanceFieldEnum)[keyof typeof PaymentOrderByRelevanceFieldEnum]


  export const QuotationOrderByRelevanceFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    quotationNo: 'quotationNo',
    gstType: 'gstType',
    status: 'status',
    convertedInvoiceId: 'convertedInvoiceId',
    notes: 'notes',
    createdById: 'createdById',
    billingAddress1: 'billingAddress1',
    billingAddress2: 'billingAddress2',
    billingGst: 'billingGst',
    billingName: 'billingName',
    billingPhone: 'billingPhone',
    billingPinCode: 'billingPinCode',
    billingState: 'billingState',
    shippingAddress1: 'shippingAddress1',
    shippingAddress2: 'shippingAddress2',
    shippingName: 'shippingName',
    shippingPinCode: 'shippingPinCode',
    shippingState: 'shippingState'
  };

  export type QuotationOrderByRelevanceFieldEnum = (typeof QuotationOrderByRelevanceFieldEnum)[keyof typeof QuotationOrderByRelevanceFieldEnum]


  export const QuotationLineItemOrderByRelevanceFieldEnum: {
    id: 'id',
    quotationId: 'quotationId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    unit: 'unit',
    pkgType: 'pkgType'
  };

  export type QuotationLineItemOrderByRelevanceFieldEnum = (typeof QuotationLineItemOrderByRelevanceFieldEnum)[keyof typeof QuotationLineItemOrderByRelevanceFieldEnum]


  export const CompanySettingOrderByRelevanceFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    gstin: 'gstin',
    pan: 'pan',
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    state: 'state',
    pincode: 'pincode',
    phone: 'phone',
    email: 'email',
    website: 'website',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    bankAccountNo: 'bankAccountNo',
    bankIfsc: 'bankIfsc',
    bankAccountName: 'bankAccountName',
    invoicePrefix: 'invoicePrefix',
    quotationPrefix: 'quotationPrefix',
    defaultGstType: 'defaultGstType',
    currency: 'currency'
  };

  export type CompanySettingOrderByRelevanceFieldEnum = (typeof CompanySettingOrderByRelevanceFieldEnum)[keyof typeof CompanySettingOrderByRelevanceFieldEnum]


  export const InvoiceLineItemOrderByRelevanceFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    unit: 'unit',
    pkgType: 'pkgType'
  };

  export type InvoiceLineItemOrderByRelevanceFieldEnum = (typeof InvoiceLineItemOrderByRelevanceFieldEnum)[keyof typeof InvoiceLineItemOrderByRelevanceFieldEnum]


  export const AuditLogOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    details: 'details',
    ipAddress: 'ipAddress'
  };

  export type AuditLogOrderByRelevanceFieldEnum = (typeof AuditLogOrderByRelevanceFieldEnum)[keyof typeof AuditLogOrderByRelevanceFieldEnum]


  export const VendorOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    gst: 'gst',
    email: 'email',
    phone: 'phone',
    address1: 'address1',
    address2: 'address2',
    state: 'state',
    createdById: 'createdById',
    updatedById: 'updatedById',
    pinCode: 'pinCode'
  };

  export type VendorOrderByRelevanceFieldEnum = (typeof VendorOrderByRelevanceFieldEnum)[keyof typeof VendorOrderByRelevanceFieldEnum]


  export const PurchaseOrderByRelevanceFieldEnum: {
    id: 'id',
    vendorId: 'vendorId',
    purchaseNo: 'purchaseNo',
    gstType: 'gstType',
    status: 'status',
    ewayBill: 'ewayBill',
    ewayBillUrl: 'ewayBillUrl',
    vehicleNo: 'vehicleNo',
    dispatchedThrough: 'dispatchedThrough',
    createdById: 'createdById',
    notes: 'notes'
  };

  export type PurchaseOrderByRelevanceFieldEnum = (typeof PurchaseOrderByRelevanceFieldEnum)[keyof typeof PurchaseOrderByRelevanceFieldEnum]


  export const PurchaseLineItemOrderByRelevanceFieldEnum: {
    id: 'id',
    purchaseId: 'purchaseId',
    productId: 'productId',
    description: 'description',
    hsn: 'hsn',
    unit: 'unit',
    pkgType: 'pkgType'
  };

  export type PurchaseLineItemOrderByRelevanceFieldEnum = (typeof PurchaseLineItemOrderByRelevanceFieldEnum)[keyof typeof PurchaseLineItemOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableFilter<"User"> | string | null
    failedLogins?: IntFilter<"User"> | number
    isLockedOut?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAudits?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastLoginIp?: SortOrderInput | SortOrder
    failedLogins?: SortOrder
    isLockedOut?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAudits?: AuditLogOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableFilter<"User"> | string | null
    failedLogins?: IntFilter<"User"> | number
    isLockedOut?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAudits?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    lastLoginIp?: SortOrderInput | SortOrder
    failedLogins?: SortOrder
    isLockedOut?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastLoginIp?: StringNullableWithAggregatesFilter<"User"> | string | null
    failedLogins?: IntWithAggregatesFilter<"User"> | number
    isLockedOut?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    gst?: StringNullableFilter<"Client"> | string | null
    email?: StringNullableFilter<"Client"> | string | null
    phone?: StringNullableFilter<"Client"> | string | null
    address1?: StringFilter<"Client"> | string
    address2?: StringNullableFilter<"Client"> | string | null
    state?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    createdById?: StringNullableFilter<"Client"> | string | null
    updatedById?: StringNullableFilter<"Client"> | string | null
    pinCode?: StringNullableFilter<"Client"> | string | null
    active?: BoolFilter<"Client"> | boolean
    invoices?: InvoiceListRelationFilter
    quotations?: QuotationListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    pinCode?: SortOrderInput | SortOrder
    active?: SortOrder
    invoices?: InvoiceOrderByRelationAggregateInput
    quotations?: QuotationOrderByRelationAggregateInput
    _relevance?: ClientOrderByRelevanceInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    name?: StringFilter<"Client"> | string
    gst?: StringNullableFilter<"Client"> | string | null
    email?: StringNullableFilter<"Client"> | string | null
    phone?: StringNullableFilter<"Client"> | string | null
    address1?: StringFilter<"Client"> | string
    address2?: StringNullableFilter<"Client"> | string | null
    state?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    createdById?: StringNullableFilter<"Client"> | string | null
    updatedById?: StringNullableFilter<"Client"> | string | null
    pinCode?: StringNullableFilter<"Client"> | string | null
    active?: BoolFilter<"Client"> | boolean
    invoices?: InvoiceListRelationFilter
    quotations?: QuotationListRelationFilter
  }, "id">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    pinCode?: SortOrderInput | SortOrder
    active?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    name?: StringWithAggregatesFilter<"Client"> | string
    gst?: StringNullableWithAggregatesFilter<"Client"> | string | null
    email?: StringNullableWithAggregatesFilter<"Client"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    address1?: StringWithAggregatesFilter<"Client"> | string
    address2?: StringNullableWithAggregatesFilter<"Client"> | string | null
    state?: StringWithAggregatesFilter<"Client"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Client"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"Client"> | string | null
    updatedById?: StringNullableWithAggregatesFilter<"Client"> | string | null
    pinCode?: StringNullableWithAggregatesFilter<"Client"> | string | null
    active?: BoolWithAggregatesFilter<"Client"> | boolean
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    sku?: StringNullableFilter<"Product"> | string | null
    description?: StringFilter<"Product"> | string
    hsn?: StringNullableFilter<"Product"> | string | null
    gstRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"Product"> | string
    notes?: StringNullableFilter<"Product"> | string | null
    pkgType?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    active?: BoolFilter<"Product"> | boolean
    purchaseRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemListRelationFilter
    quotationLines?: QuotationLineItemListRelationFilter
    purchaseLines?: PurchaseLineItemListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    sku?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    gstRate?: SortOrder
    unit?: SortOrder
    notes?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    active?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
    invoiceLines?: InvoiceLineItemOrderByRelationAggregateInput
    quotationLines?: QuotationLineItemOrderByRelationAggregateInput
    purchaseLines?: PurchaseLineItemOrderByRelationAggregateInput
    _relevance?: ProductOrderByRelevanceInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    description?: StringFilter<"Product"> | string
    hsn?: StringNullableFilter<"Product"> | string | null
    gstRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"Product"> | string
    notes?: StringNullableFilter<"Product"> | string | null
    pkgType?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    active?: BoolFilter<"Product"> | boolean
    purchaseRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFilter<"Product"> | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemListRelationFilter
    quotationLines?: QuotationLineItemListRelationFilter
    purchaseLines?: PurchaseLineItemListRelationFilter
  }, "id" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    sku?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    gstRate?: SortOrder
    unit?: SortOrder
    notes?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    active?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    sku?: StringNullableWithAggregatesFilter<"Product"> | string | null
    description?: StringWithAggregatesFilter<"Product"> | string
    hsn?: StringNullableWithAggregatesFilter<"Product"> | string | null
    gstRate?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    unit?: StringWithAggregatesFilter<"Product"> | string
    notes?: StringNullableWithAggregatesFilter<"Product"> | string | null
    pkgType?: StringNullableWithAggregatesFilter<"Product"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Product"> | Date | string | null
    active?: BoolWithAggregatesFilter<"Product"> | boolean
    purchaseRate?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    clientId?: StringFilter<"Invoice"> | string
    sequenceNumber?: IntFilter<"Invoice"> | number
    invoiceNo?: StringFilter<"Invoice"> | string
    date?: DateTimeFilter<"Invoice"> | Date | string
    gstType?: StringFilter<"Invoice"> | string
    subTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Invoice"> | string
    ewayBill?: StringNullableFilter<"Invoice"> | string | null
    vehicleNo?: StringNullableFilter<"Invoice"> | string | null
    dispatchedThrough?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    createdById?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    billingAddress1?: StringNullableFilter<"Invoice"> | string | null
    billingAddress2?: StringNullableFilter<"Invoice"> | string | null
    billingGst?: StringNullableFilter<"Invoice"> | string | null
    billingName?: StringNullableFilter<"Invoice"> | string | null
    billingPhone?: StringNullableFilter<"Invoice"> | string | null
    billingPinCode?: StringNullableFilter<"Invoice"> | string | null
    billingState?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress1?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress2?: StringNullableFilter<"Invoice"> | string | null
    shippingName?: StringNullableFilter<"Invoice"> | string | null
    shippingPinCode?: StringNullableFilter<"Invoice"> | string | null
    shippingSameAsBilling?: BoolFilter<"Invoice"> | boolean
    shippingState?: StringNullableFilter<"Invoice"> | string | null
    ewayBillUrl?: StringNullableFilter<"Invoice"> | string | null
    lineItems?: InvoiceLineItemListRelationFilter
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    invoiceNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    dispatchedThrough?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    billingAddress1?: SortOrderInput | SortOrder
    billingAddress2?: SortOrderInput | SortOrder
    billingGst?: SortOrderInput | SortOrder
    billingName?: SortOrderInput | SortOrder
    billingPhone?: SortOrderInput | SortOrder
    billingPinCode?: SortOrderInput | SortOrder
    billingState?: SortOrderInput | SortOrder
    shippingAddress1?: SortOrderInput | SortOrder
    shippingAddress2?: SortOrderInput | SortOrder
    shippingName?: SortOrderInput | SortOrder
    shippingPinCode?: SortOrderInput | SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrderInput | SortOrder
    ewayBillUrl?: SortOrderInput | SortOrder
    lineItems?: InvoiceLineItemOrderByRelationAggregateInput
    client?: ClientOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
    _relevance?: InvoiceOrderByRelevanceInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sequenceNumber?: number
    invoiceNo?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    clientId?: StringFilter<"Invoice"> | string
    date?: DateTimeFilter<"Invoice"> | Date | string
    gstType?: StringFilter<"Invoice"> | string
    subTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Invoice"> | string
    ewayBill?: StringNullableFilter<"Invoice"> | string | null
    vehicleNo?: StringNullableFilter<"Invoice"> | string | null
    dispatchedThrough?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    createdById?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    billingAddress1?: StringNullableFilter<"Invoice"> | string | null
    billingAddress2?: StringNullableFilter<"Invoice"> | string | null
    billingGst?: StringNullableFilter<"Invoice"> | string | null
    billingName?: StringNullableFilter<"Invoice"> | string | null
    billingPhone?: StringNullableFilter<"Invoice"> | string | null
    billingPinCode?: StringNullableFilter<"Invoice"> | string | null
    billingState?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress1?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress2?: StringNullableFilter<"Invoice"> | string | null
    shippingName?: StringNullableFilter<"Invoice"> | string | null
    shippingPinCode?: StringNullableFilter<"Invoice"> | string | null
    shippingSameAsBilling?: BoolFilter<"Invoice"> | boolean
    shippingState?: StringNullableFilter<"Invoice"> | string | null
    ewayBillUrl?: StringNullableFilter<"Invoice"> | string | null
    lineItems?: InvoiceLineItemListRelationFilter
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    payments?: PaymentListRelationFilter
  }, "id" | "sequenceNumber" | "invoiceNo">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    invoiceNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    dispatchedThrough?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    billingAddress1?: SortOrderInput | SortOrder
    billingAddress2?: SortOrderInput | SortOrder
    billingGst?: SortOrderInput | SortOrder
    billingName?: SortOrderInput | SortOrder
    billingPhone?: SortOrderInput | SortOrder
    billingPinCode?: SortOrderInput | SortOrder
    billingState?: SortOrderInput | SortOrder
    shippingAddress1?: SortOrderInput | SortOrder
    shippingAddress2?: SortOrderInput | SortOrder
    shippingName?: SortOrderInput | SortOrder
    shippingPinCode?: SortOrderInput | SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrderInput | SortOrder
    ewayBillUrl?: SortOrderInput | SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    clientId?: StringWithAggregatesFilter<"Invoice"> | string
    sequenceNumber?: IntWithAggregatesFilter<"Invoice"> | number
    invoiceNo?: StringWithAggregatesFilter<"Invoice"> | string
    date?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    gstType?: StringWithAggregatesFilter<"Invoice"> | string
    subTotal?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Invoice"> | string
    ewayBill?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    vehicleNo?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    dispatchedThrough?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingAddress1?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingAddress2?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingGst?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingName?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingPhone?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingPinCode?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    billingState?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    shippingAddress1?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    shippingAddress2?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    shippingName?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    shippingPinCode?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    shippingSameAsBilling?: BoolWithAggregatesFilter<"Invoice"> | boolean
    shippingState?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    ewayBillUrl?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    invoiceId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFilter<"Payment"> | Date | string
    method?: StringFilter<"Payment"> | string
    reference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    recordedBy?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    amount?: SortOrder
    paidAt?: SortOrder
    method?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
    _relevance?: PaymentOrderByRelevanceInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    invoiceId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFilter<"Payment"> | Date | string
    method?: StringFilter<"Payment"> | string
    reference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    recordedBy?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    amount?: SortOrder
    paidAt?: SortOrder
    method?: SortOrder
    reference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    recordedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    invoiceId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    method?: StringWithAggregatesFilter<"Payment"> | string
    reference?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    recordedBy?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type QuotationWhereInput = {
    AND?: QuotationWhereInput | QuotationWhereInput[]
    OR?: QuotationWhereInput[]
    NOT?: QuotationWhereInput | QuotationWhereInput[]
    id?: StringFilter<"Quotation"> | string
    clientId?: StringFilter<"Quotation"> | string
    sequenceNumber?: IntFilter<"Quotation"> | number
    quotationNo?: StringFilter<"Quotation"> | string
    date?: DateTimeFilter<"Quotation"> | Date | string
    validUntil?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    gstType?: StringFilter<"Quotation"> | string
    subTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Quotation"> | string
    convertedInvoiceId?: StringNullableFilter<"Quotation"> | string | null
    notes?: StringNullableFilter<"Quotation"> | string | null
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    createdById?: StringNullableFilter<"Quotation"> | string | null
    billingAddress1?: StringNullableFilter<"Quotation"> | string | null
    billingAddress2?: StringNullableFilter<"Quotation"> | string | null
    billingGst?: StringNullableFilter<"Quotation"> | string | null
    billingName?: StringNullableFilter<"Quotation"> | string | null
    billingPhone?: StringNullableFilter<"Quotation"> | string | null
    billingPinCode?: StringNullableFilter<"Quotation"> | string | null
    billingState?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress1?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress2?: StringNullableFilter<"Quotation"> | string | null
    shippingName?: StringNullableFilter<"Quotation"> | string | null
    shippingPinCode?: StringNullableFilter<"Quotation"> | string | null
    shippingSameAsBilling?: BoolFilter<"Quotation"> | boolean
    shippingState?: StringNullableFilter<"Quotation"> | string | null
    lineItems?: QuotationLineItemListRelationFilter
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }

  export type QuotationOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    quotationNo?: SortOrder
    date?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    status?: SortOrder
    convertedInvoiceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    billingAddress1?: SortOrderInput | SortOrder
    billingAddress2?: SortOrderInput | SortOrder
    billingGst?: SortOrderInput | SortOrder
    billingName?: SortOrderInput | SortOrder
    billingPhone?: SortOrderInput | SortOrder
    billingPinCode?: SortOrderInput | SortOrder
    billingState?: SortOrderInput | SortOrder
    shippingAddress1?: SortOrderInput | SortOrder
    shippingAddress2?: SortOrderInput | SortOrder
    shippingName?: SortOrderInput | SortOrder
    shippingPinCode?: SortOrderInput | SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrderInput | SortOrder
    lineItems?: QuotationLineItemOrderByRelationAggregateInput
    client?: ClientOrderByWithRelationInput
    _relevance?: QuotationOrderByRelevanceInput
  }

  export type QuotationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sequenceNumber?: number
    quotationNo?: string
    AND?: QuotationWhereInput | QuotationWhereInput[]
    OR?: QuotationWhereInput[]
    NOT?: QuotationWhereInput | QuotationWhereInput[]
    clientId?: StringFilter<"Quotation"> | string
    date?: DateTimeFilter<"Quotation"> | Date | string
    validUntil?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    gstType?: StringFilter<"Quotation"> | string
    subTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Quotation"> | string
    convertedInvoiceId?: StringNullableFilter<"Quotation"> | string | null
    notes?: StringNullableFilter<"Quotation"> | string | null
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    createdById?: StringNullableFilter<"Quotation"> | string | null
    billingAddress1?: StringNullableFilter<"Quotation"> | string | null
    billingAddress2?: StringNullableFilter<"Quotation"> | string | null
    billingGst?: StringNullableFilter<"Quotation"> | string | null
    billingName?: StringNullableFilter<"Quotation"> | string | null
    billingPhone?: StringNullableFilter<"Quotation"> | string | null
    billingPinCode?: StringNullableFilter<"Quotation"> | string | null
    billingState?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress1?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress2?: StringNullableFilter<"Quotation"> | string | null
    shippingName?: StringNullableFilter<"Quotation"> | string | null
    shippingPinCode?: StringNullableFilter<"Quotation"> | string | null
    shippingSameAsBilling?: BoolFilter<"Quotation"> | boolean
    shippingState?: StringNullableFilter<"Quotation"> | string | null
    lineItems?: QuotationLineItemListRelationFilter
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }, "id" | "sequenceNumber" | "quotationNo">

  export type QuotationOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    quotationNo?: SortOrder
    date?: SortOrder
    validUntil?: SortOrderInput | SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    status?: SortOrder
    convertedInvoiceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    billingAddress1?: SortOrderInput | SortOrder
    billingAddress2?: SortOrderInput | SortOrder
    billingGst?: SortOrderInput | SortOrder
    billingName?: SortOrderInput | SortOrder
    billingPhone?: SortOrderInput | SortOrder
    billingPinCode?: SortOrderInput | SortOrder
    billingState?: SortOrderInput | SortOrder
    shippingAddress1?: SortOrderInput | SortOrder
    shippingAddress2?: SortOrderInput | SortOrder
    shippingName?: SortOrderInput | SortOrder
    shippingPinCode?: SortOrderInput | SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrderInput | SortOrder
    _count?: QuotationCountOrderByAggregateInput
    _avg?: QuotationAvgOrderByAggregateInput
    _max?: QuotationMaxOrderByAggregateInput
    _min?: QuotationMinOrderByAggregateInput
    _sum?: QuotationSumOrderByAggregateInput
  }

  export type QuotationScalarWhereWithAggregatesInput = {
    AND?: QuotationScalarWhereWithAggregatesInput | QuotationScalarWhereWithAggregatesInput[]
    OR?: QuotationScalarWhereWithAggregatesInput[]
    NOT?: QuotationScalarWhereWithAggregatesInput | QuotationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quotation"> | string
    clientId?: StringWithAggregatesFilter<"Quotation"> | string
    sequenceNumber?: IntWithAggregatesFilter<"Quotation"> | number
    quotationNo?: StringWithAggregatesFilter<"Quotation"> | string
    date?: DateTimeWithAggregatesFilter<"Quotation"> | Date | string
    validUntil?: DateTimeNullableWithAggregatesFilter<"Quotation"> | Date | string | null
    gstType?: StringWithAggregatesFilter<"Quotation"> | string
    subTotal?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalWithAggregatesFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Quotation"> | string
    convertedInvoiceId?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quotation"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Quotation"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingAddress1?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingAddress2?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingGst?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingName?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingPhone?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingPinCode?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    billingState?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    shippingAddress1?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    shippingAddress2?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    shippingName?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    shippingPinCode?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
    shippingSameAsBilling?: BoolWithAggregatesFilter<"Quotation"> | boolean
    shippingState?: StringNullableWithAggregatesFilter<"Quotation"> | string | null
  }

  export type QuotationLineItemWhereInput = {
    AND?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    OR?: QuotationLineItemWhereInput[]
    NOT?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    id?: StringFilter<"QuotationLineItem"> | string
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringNullableFilter<"QuotationLineItem"> | string | null
    description?: StringFilter<"QuotationLineItem"> | string
    hsn?: StringNullableFilter<"QuotationLineItem"> | string | null
    qty?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"QuotationLineItem"> | string
    pkgCount?: IntNullableFilter<"QuotationLineItem"> | number | null
    pkgType?: StringNullableFilter<"QuotationLineItem"> | string | null
    totalAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }

  export type QuotationLineItemOrderByWithRelationInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    quotation?: QuotationOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
    _relevance?: QuotationLineItemOrderByRelevanceInput
  }

  export type QuotationLineItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    OR?: QuotationLineItemWhereInput[]
    NOT?: QuotationLineItemWhereInput | QuotationLineItemWhereInput[]
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringNullableFilter<"QuotationLineItem"> | string | null
    description?: StringFilter<"QuotationLineItem"> | string
    hsn?: StringNullableFilter<"QuotationLineItem"> | string | null
    qty?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"QuotationLineItem"> | string
    pkgCount?: IntNullableFilter<"QuotationLineItem"> | number | null
    pkgType?: StringNullableFilter<"QuotationLineItem"> | string | null
    totalAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    quotation?: XOR<QuotationScalarRelationFilter, QuotationWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }, "id">

  export type QuotationLineItemOrderByWithAggregationInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    _count?: QuotationLineItemCountOrderByAggregateInput
    _avg?: QuotationLineItemAvgOrderByAggregateInput
    _max?: QuotationLineItemMaxOrderByAggregateInput
    _min?: QuotationLineItemMinOrderByAggregateInput
    _sum?: QuotationLineItemSumOrderByAggregateInput
  }

  export type QuotationLineItemScalarWhereWithAggregatesInput = {
    AND?: QuotationLineItemScalarWhereWithAggregatesInput | QuotationLineItemScalarWhereWithAggregatesInput[]
    OR?: QuotationLineItemScalarWhereWithAggregatesInput[]
    NOT?: QuotationLineItemScalarWhereWithAggregatesInput | QuotationLineItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    quotationId?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    productId?: StringNullableWithAggregatesFilter<"QuotationLineItem"> | string | null
    description?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    hsn?: StringNullableWithAggregatesFilter<"QuotationLineItem"> | string | null
    qty?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringWithAggregatesFilter<"QuotationLineItem"> | string
    pkgCount?: IntNullableWithAggregatesFilter<"QuotationLineItem"> | number | null
    pkgType?: StringNullableWithAggregatesFilter<"QuotationLineItem"> | string | null
    totalAmount?: DecimalWithAggregatesFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type CompanySettingWhereInput = {
    AND?: CompanySettingWhereInput | CompanySettingWhereInput[]
    OR?: CompanySettingWhereInput[]
    NOT?: CompanySettingWhereInput | CompanySettingWhereInput[]
    id?: StringFilter<"CompanySetting"> | string
    companyName?: StringFilter<"CompanySetting"> | string
    gstin?: StringFilter<"CompanySetting"> | string
    pan?: StringNullableFilter<"CompanySetting"> | string | null
    address1?: StringFilter<"CompanySetting"> | string
    address2?: StringNullableFilter<"CompanySetting"> | string | null
    city?: StringFilter<"CompanySetting"> | string
    state?: StringFilter<"CompanySetting"> | string
    pincode?: StringFilter<"CompanySetting"> | string
    phone?: StringFilter<"CompanySetting"> | string
    email?: StringFilter<"CompanySetting"> | string
    website?: StringNullableFilter<"CompanySetting"> | string | null
    bankName?: StringFilter<"CompanySetting"> | string
    bankBranch?: StringFilter<"CompanySetting"> | string
    bankAccountNo?: StringFilter<"CompanySetting"> | string
    bankIfsc?: StringFilter<"CompanySetting"> | string
    bankAccountName?: StringFilter<"CompanySetting"> | string
    invoicePrefix?: StringFilter<"CompanySetting"> | string
    quotationPrefix?: StringFilter<"CompanySetting"> | string
    defaultGstType?: StringFilter<"CompanySetting"> | string
    currency?: StringFilter<"CompanySetting"> | string
    showPkgDetails?: BoolFilter<"CompanySetting"> | boolean
    updatedAt?: DateTimeFilter<"CompanySetting"> | Date | string
  }

  export type CompanySettingOrderByWithRelationInput = {
    id?: SortOrder
    companyName?: SortOrder
    gstin?: SortOrder
    pan?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    website?: SortOrderInput | SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    bankAccountNo?: SortOrder
    bankIfsc?: SortOrder
    bankAccountName?: SortOrder
    invoicePrefix?: SortOrder
    quotationPrefix?: SortOrder
    defaultGstType?: SortOrder
    currency?: SortOrder
    showPkgDetails?: SortOrder
    updatedAt?: SortOrder
    _relevance?: CompanySettingOrderByRelevanceInput
  }

  export type CompanySettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompanySettingWhereInput | CompanySettingWhereInput[]
    OR?: CompanySettingWhereInput[]
    NOT?: CompanySettingWhereInput | CompanySettingWhereInput[]
    companyName?: StringFilter<"CompanySetting"> | string
    gstin?: StringFilter<"CompanySetting"> | string
    pan?: StringNullableFilter<"CompanySetting"> | string | null
    address1?: StringFilter<"CompanySetting"> | string
    address2?: StringNullableFilter<"CompanySetting"> | string | null
    city?: StringFilter<"CompanySetting"> | string
    state?: StringFilter<"CompanySetting"> | string
    pincode?: StringFilter<"CompanySetting"> | string
    phone?: StringFilter<"CompanySetting"> | string
    email?: StringFilter<"CompanySetting"> | string
    website?: StringNullableFilter<"CompanySetting"> | string | null
    bankName?: StringFilter<"CompanySetting"> | string
    bankBranch?: StringFilter<"CompanySetting"> | string
    bankAccountNo?: StringFilter<"CompanySetting"> | string
    bankIfsc?: StringFilter<"CompanySetting"> | string
    bankAccountName?: StringFilter<"CompanySetting"> | string
    invoicePrefix?: StringFilter<"CompanySetting"> | string
    quotationPrefix?: StringFilter<"CompanySetting"> | string
    defaultGstType?: StringFilter<"CompanySetting"> | string
    currency?: StringFilter<"CompanySetting"> | string
    showPkgDetails?: BoolFilter<"CompanySetting"> | boolean
    updatedAt?: DateTimeFilter<"CompanySetting"> | Date | string
  }, "id">

  export type CompanySettingOrderByWithAggregationInput = {
    id?: SortOrder
    companyName?: SortOrder
    gstin?: SortOrder
    pan?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    website?: SortOrderInput | SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    bankAccountNo?: SortOrder
    bankIfsc?: SortOrder
    bankAccountName?: SortOrder
    invoicePrefix?: SortOrder
    quotationPrefix?: SortOrder
    defaultGstType?: SortOrder
    currency?: SortOrder
    showPkgDetails?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanySettingCountOrderByAggregateInput
    _max?: CompanySettingMaxOrderByAggregateInput
    _min?: CompanySettingMinOrderByAggregateInput
  }

  export type CompanySettingScalarWhereWithAggregatesInput = {
    AND?: CompanySettingScalarWhereWithAggregatesInput | CompanySettingScalarWhereWithAggregatesInput[]
    OR?: CompanySettingScalarWhereWithAggregatesInput[]
    NOT?: CompanySettingScalarWhereWithAggregatesInput | CompanySettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompanySetting"> | string
    companyName?: StringWithAggregatesFilter<"CompanySetting"> | string
    gstin?: StringWithAggregatesFilter<"CompanySetting"> | string
    pan?: StringNullableWithAggregatesFilter<"CompanySetting"> | string | null
    address1?: StringWithAggregatesFilter<"CompanySetting"> | string
    address2?: StringNullableWithAggregatesFilter<"CompanySetting"> | string | null
    city?: StringWithAggregatesFilter<"CompanySetting"> | string
    state?: StringWithAggregatesFilter<"CompanySetting"> | string
    pincode?: StringWithAggregatesFilter<"CompanySetting"> | string
    phone?: StringWithAggregatesFilter<"CompanySetting"> | string
    email?: StringWithAggregatesFilter<"CompanySetting"> | string
    website?: StringNullableWithAggregatesFilter<"CompanySetting"> | string | null
    bankName?: StringWithAggregatesFilter<"CompanySetting"> | string
    bankBranch?: StringWithAggregatesFilter<"CompanySetting"> | string
    bankAccountNo?: StringWithAggregatesFilter<"CompanySetting"> | string
    bankIfsc?: StringWithAggregatesFilter<"CompanySetting"> | string
    bankAccountName?: StringWithAggregatesFilter<"CompanySetting"> | string
    invoicePrefix?: StringWithAggregatesFilter<"CompanySetting"> | string
    quotationPrefix?: StringWithAggregatesFilter<"CompanySetting"> | string
    defaultGstType?: StringWithAggregatesFilter<"CompanySetting"> | string
    currency?: StringWithAggregatesFilter<"CompanySetting"> | string
    showPkgDetails?: BoolWithAggregatesFilter<"CompanySetting"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"CompanySetting"> | Date | string
  }

  export type InvoiceLineItemWhereInput = {
    AND?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    OR?: InvoiceLineItemWhereInput[]
    NOT?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    id?: StringFilter<"InvoiceLineItem"> | string
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    productId?: StringNullableFilter<"InvoiceLineItem"> | string | null
    description?: StringFilter<"InvoiceLineItem"> | string
    hsn?: StringNullableFilter<"InvoiceLineItem"> | string | null
    qty?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"InvoiceLineItem"> | string
    pkgCount?: IntNullableFilter<"InvoiceLineItem"> | number | null
    pkgType?: StringNullableFilter<"InvoiceLineItem"> | string | null
    totalAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }

  export type InvoiceLineItemOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
    _relevance?: InvoiceLineItemOrderByRelevanceInput
  }

  export type InvoiceLineItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    OR?: InvoiceLineItemWhereInput[]
    NOT?: InvoiceLineItemWhereInput | InvoiceLineItemWhereInput[]
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    productId?: StringNullableFilter<"InvoiceLineItem"> | string | null
    description?: StringFilter<"InvoiceLineItem"> | string
    hsn?: StringNullableFilter<"InvoiceLineItem"> | string | null
    qty?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"InvoiceLineItem"> | string
    pkgCount?: IntNullableFilter<"InvoiceLineItem"> | number | null
    pkgType?: StringNullableFilter<"InvoiceLineItem"> | string | null
    totalAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    invoice?: XOR<InvoiceScalarRelationFilter, InvoiceWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }, "id">

  export type InvoiceLineItemOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    _count?: InvoiceLineItemCountOrderByAggregateInput
    _avg?: InvoiceLineItemAvgOrderByAggregateInput
    _max?: InvoiceLineItemMaxOrderByAggregateInput
    _min?: InvoiceLineItemMinOrderByAggregateInput
    _sum?: InvoiceLineItemSumOrderByAggregateInput
  }

  export type InvoiceLineItemScalarWhereWithAggregatesInput = {
    AND?: InvoiceLineItemScalarWhereWithAggregatesInput | InvoiceLineItemScalarWhereWithAggregatesInput[]
    OR?: InvoiceLineItemScalarWhereWithAggregatesInput[]
    NOT?: InvoiceLineItemScalarWhereWithAggregatesInput | InvoiceLineItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    invoiceId?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    productId?: StringNullableWithAggregatesFilter<"InvoiceLineItem"> | string | null
    description?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    hsn?: StringNullableWithAggregatesFilter<"InvoiceLineItem"> | string | null
    qty?: DecimalWithAggregatesFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalWithAggregatesFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalWithAggregatesFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalWithAggregatesFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringWithAggregatesFilter<"InvoiceLineItem"> | string
    pkgCount?: IntNullableWithAggregatesFilter<"InvoiceLineItem"> | number | null
    pkgType?: StringNullableWithAggregatesFilter<"InvoiceLineItem"> | string | null
    totalAmount?: DecimalWithAggregatesFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: AuditLogOrderByRelevanceInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: StringFilter<"Vendor"> | string
    name?: StringFilter<"Vendor"> | string
    gst?: StringNullableFilter<"Vendor"> | string | null
    email?: StringNullableFilter<"Vendor"> | string | null
    phone?: StringNullableFilter<"Vendor"> | string | null
    address1?: StringFilter<"Vendor"> | string
    address2?: StringNullableFilter<"Vendor"> | string | null
    state?: StringFilter<"Vendor"> | string
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Vendor"> | Date | string | null
    createdById?: StringNullableFilter<"Vendor"> | string | null
    updatedById?: StringNullableFilter<"Vendor"> | string | null
    pinCode?: StringNullableFilter<"Vendor"> | string | null
    active?: BoolFilter<"Vendor"> | boolean
    purchases?: PurchaseListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    pinCode?: SortOrderInput | SortOrder
    active?: SortOrder
    purchases?: PurchaseOrderByRelationAggregateInput
    _relevance?: VendorOrderByRelevanceInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    name?: StringFilter<"Vendor"> | string
    gst?: StringNullableFilter<"Vendor"> | string | null
    email?: StringNullableFilter<"Vendor"> | string | null
    phone?: StringNullableFilter<"Vendor"> | string | null
    address1?: StringFilter<"Vendor"> | string
    address2?: StringNullableFilter<"Vendor"> | string | null
    state?: StringFilter<"Vendor"> | string
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Vendor"> | Date | string | null
    createdById?: StringNullableFilter<"Vendor"> | string | null
    updatedById?: StringNullableFilter<"Vendor"> | string | null
    pinCode?: StringNullableFilter<"Vendor"> | string | null
    active?: BoolFilter<"Vendor"> | boolean
    purchases?: PurchaseListRelationFilter
  }, "id">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address1?: SortOrder
    address2?: SortOrderInput | SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    pinCode?: SortOrderInput | SortOrder
    active?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vendor"> | string
    name?: StringWithAggregatesFilter<"Vendor"> | string
    gst?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    email?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    address1?: StringWithAggregatesFilter<"Vendor"> | string
    address2?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    state?: StringWithAggregatesFilter<"Vendor"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Vendor"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    updatedById?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    pinCode?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    active?: BoolWithAggregatesFilter<"Vendor"> | boolean
  }

  export type PurchaseWhereInput = {
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    id?: StringFilter<"Purchase"> | string
    vendorId?: StringFilter<"Purchase"> | string
    sequenceNumber?: IntFilter<"Purchase"> | number
    purchaseNo?: StringFilter<"Purchase"> | string
    date?: DateTimeFilter<"Purchase"> | Date | string
    gstType?: StringFilter<"Purchase"> | string
    subTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Purchase"> | string
    ewayBill?: StringNullableFilter<"Purchase"> | string | null
    ewayBillUrl?: StringNullableFilter<"Purchase"> | string | null
    vehicleNo?: StringNullableFilter<"Purchase"> | string | null
    dispatchedThrough?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Purchase"> | Date | string | null
    createdById?: StringNullableFilter<"Purchase"> | string | null
    notes?: StringNullableFilter<"Purchase"> | string | null
    lineItems?: PurchaseLineItemListRelationFilter
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }

  export type PurchaseOrderByWithRelationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    sequenceNumber?: SortOrder
    purchaseNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrderInput | SortOrder
    ewayBillUrl?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    dispatchedThrough?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    lineItems?: PurchaseLineItemOrderByRelationAggregateInput
    vendor?: VendorOrderByWithRelationInput
    _relevance?: PurchaseOrderByRelevanceInput
  }

  export type PurchaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sequenceNumber?: number
    purchaseNo?: string
    AND?: PurchaseWhereInput | PurchaseWhereInput[]
    OR?: PurchaseWhereInput[]
    NOT?: PurchaseWhereInput | PurchaseWhereInput[]
    vendorId?: StringFilter<"Purchase"> | string
    date?: DateTimeFilter<"Purchase"> | Date | string
    gstType?: StringFilter<"Purchase"> | string
    subTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Purchase"> | string
    ewayBill?: StringNullableFilter<"Purchase"> | string | null
    ewayBillUrl?: StringNullableFilter<"Purchase"> | string | null
    vehicleNo?: StringNullableFilter<"Purchase"> | string | null
    dispatchedThrough?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Purchase"> | Date | string | null
    createdById?: StringNullableFilter<"Purchase"> | string | null
    notes?: StringNullableFilter<"Purchase"> | string | null
    lineItems?: PurchaseLineItemListRelationFilter
    vendor?: XOR<VendorScalarRelationFilter, VendorWhereInput>
  }, "id" | "sequenceNumber" | "purchaseNo">

  export type PurchaseOrderByWithAggregationInput = {
    id?: SortOrder
    vendorId?: SortOrder
    sequenceNumber?: SortOrder
    purchaseNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrderInput | SortOrder
    ewayBillUrl?: SortOrderInput | SortOrder
    vehicleNo?: SortOrderInput | SortOrder
    dispatchedThrough?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: PurchaseCountOrderByAggregateInput
    _avg?: PurchaseAvgOrderByAggregateInput
    _max?: PurchaseMaxOrderByAggregateInput
    _min?: PurchaseMinOrderByAggregateInput
    _sum?: PurchaseSumOrderByAggregateInput
  }

  export type PurchaseScalarWhereWithAggregatesInput = {
    AND?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    OR?: PurchaseScalarWhereWithAggregatesInput[]
    NOT?: PurchaseScalarWhereWithAggregatesInput | PurchaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Purchase"> | string
    vendorId?: StringWithAggregatesFilter<"Purchase"> | string
    sequenceNumber?: IntWithAggregatesFilter<"Purchase"> | number
    purchaseNo?: StringWithAggregatesFilter<"Purchase"> | string
    date?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
    gstType?: StringWithAggregatesFilter<"Purchase"> | string
    subTotal?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalWithAggregatesFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Purchase"> | string
    ewayBill?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    ewayBillUrl?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    vehicleNo?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    dispatchedThrough?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Purchase"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Purchase"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Purchase"> | string | null
  }

  export type PurchaseLineItemWhereInput = {
    AND?: PurchaseLineItemWhereInput | PurchaseLineItemWhereInput[]
    OR?: PurchaseLineItemWhereInput[]
    NOT?: PurchaseLineItemWhereInput | PurchaseLineItemWhereInput[]
    id?: StringFilter<"PurchaseLineItem"> | string
    purchaseId?: StringFilter<"PurchaseLineItem"> | string
    productId?: StringNullableFilter<"PurchaseLineItem"> | string | null
    description?: StringFilter<"PurchaseLineItem"> | string
    hsn?: StringNullableFilter<"PurchaseLineItem"> | string | null
    qty?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"PurchaseLineItem"> | string
    pkgCount?: IntNullableFilter<"PurchaseLineItem"> | number | null
    pkgType?: StringNullableFilter<"PurchaseLineItem"> | string | null
    totalAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    purchase?: XOR<PurchaseScalarRelationFilter, PurchaseWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }

  export type PurchaseLineItemOrderByWithRelationInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    purchase?: PurchaseOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
    _relevance?: PurchaseLineItemOrderByRelevanceInput
  }

  export type PurchaseLineItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PurchaseLineItemWhereInput | PurchaseLineItemWhereInput[]
    OR?: PurchaseLineItemWhereInput[]
    NOT?: PurchaseLineItemWhereInput | PurchaseLineItemWhereInput[]
    purchaseId?: StringFilter<"PurchaseLineItem"> | string
    productId?: StringNullableFilter<"PurchaseLineItem"> | string | null
    description?: StringFilter<"PurchaseLineItem"> | string
    hsn?: StringNullableFilter<"PurchaseLineItem"> | string | null
    qty?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"PurchaseLineItem"> | string
    pkgCount?: IntNullableFilter<"PurchaseLineItem"> | number | null
    pkgType?: StringNullableFilter<"PurchaseLineItem"> | string | null
    totalAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    purchase?: XOR<PurchaseScalarRelationFilter, PurchaseWhereInput>
    product?: XOR<ProductNullableScalarRelationFilter, ProductWhereInput> | null
  }, "id">

  export type PurchaseLineItemOrderByWithAggregationInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrderInput | SortOrder
    description?: SortOrder
    hsn?: SortOrderInput | SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrderInput | SortOrder
    pkgType?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    _count?: PurchaseLineItemCountOrderByAggregateInput
    _avg?: PurchaseLineItemAvgOrderByAggregateInput
    _max?: PurchaseLineItemMaxOrderByAggregateInput
    _min?: PurchaseLineItemMinOrderByAggregateInput
    _sum?: PurchaseLineItemSumOrderByAggregateInput
  }

  export type PurchaseLineItemScalarWhereWithAggregatesInput = {
    AND?: PurchaseLineItemScalarWhereWithAggregatesInput | PurchaseLineItemScalarWhereWithAggregatesInput[]
    OR?: PurchaseLineItemScalarWhereWithAggregatesInput[]
    NOT?: PurchaseLineItemScalarWhereWithAggregatesInput | PurchaseLineItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PurchaseLineItem"> | string
    purchaseId?: StringWithAggregatesFilter<"PurchaseLineItem"> | string
    productId?: StringNullableWithAggregatesFilter<"PurchaseLineItem"> | string | null
    description?: StringWithAggregatesFilter<"PurchaseLineItem"> | string
    hsn?: StringNullableWithAggregatesFilter<"PurchaseLineItem"> | string | null
    qty?: DecimalWithAggregatesFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalWithAggregatesFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalWithAggregatesFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalWithAggregatesFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringWithAggregatesFilter<"PurchaseLineItem"> | string
    pkgCount?: IntNullableWithAggregatesFilter<"PurchaseLineItem"> | number | null
    pkgType?: StringNullableWithAggregatesFilter<"PurchaseLineItem"> | string | null
    totalAmount?: DecimalWithAggregatesFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: string
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    failedLogins?: number
    isLockedOut?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdAudits?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: string
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    failedLogins?: number
    isLockedOut?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdAudits?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAudits?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAudits?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: string
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    failedLogins?: number
    isLockedOut?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClientCreateInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    invoices?: InvoiceCreateNestedManyWithoutClientInput
    quotations?: QuotationCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    invoices?: InvoiceUncheckedCreateNestedManyWithoutClientInput
    quotations?: QuotationUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUpdateManyWithoutClientNestedInput
    quotations?: QuotationUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUncheckedUpdateManyWithoutClientNestedInput
    quotations?: QuotationUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemCreateNestedManyWithoutProductInput
    quotationLines?: QuotationLineItemCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedCreateNestedManyWithoutProductInput
    quotationLines?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUpdateManyWithoutProductNestedInput
    quotationLines?: QuotationLineItemUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedUpdateManyWithoutProductNestedInput
    quotationLines?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceCreateInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    client: ClientCreateNestedOneWithoutInvoicesInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    client?: ClientUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice: InvoiceCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    invoiceId: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: InvoiceUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    invoiceId: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationCreateInput = {
    id?: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    lineItems?: QuotationLineItemCreateNestedManyWithoutQuotationInput
    client: ClientCreateNestedOneWithoutQuotationsInput
  }

  export type QuotationUncheckedCreateInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    lineItems?: QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput
  }

  export type QuotationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: QuotationLineItemUpdateManyWithoutQuotationNestedInput
    client?: ClientUpdateOneRequiredWithoutQuotationsNestedInput
  }

  export type QuotationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput
  }

  export type QuotationCreateManyInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
  }

  export type QuotationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuotationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuotationLineItemCreateInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    quotation: QuotationCreateNestedOneWithoutLineItemsInput
    product?: ProductCreateNestedOneWithoutQuotationLinesInput
  }

  export type QuotationLineItemUncheckedCreateInput = {
    id?: string
    quotationId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotation?: QuotationUpdateOneRequiredWithoutLineItemsNestedInput
    product?: ProductUpdateOneWithoutQuotationLinesNestedInput
  }

  export type QuotationLineItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateManyInput = {
    id?: string
    quotationId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type CompanySettingCreateInput = {
    id?: string
    companyName?: string
    gstin?: string
    pan?: string | null
    address1?: string
    address2?: string | null
    city?: string
    state?: string
    pincode?: string
    phone?: string
    email?: string
    website?: string | null
    bankName?: string
    bankBranch?: string
    bankAccountNo?: string
    bankIfsc?: string
    bankAccountName?: string
    invoicePrefix?: string
    quotationPrefix?: string
    defaultGstType?: string
    currency?: string
    showPkgDetails?: boolean
    updatedAt?: Date | string
  }

  export type CompanySettingUncheckedCreateInput = {
    id?: string
    companyName?: string
    gstin?: string
    pan?: string | null
    address1?: string
    address2?: string | null
    city?: string
    state?: string
    pincode?: string
    phone?: string
    email?: string
    website?: string | null
    bankName?: string
    bankBranch?: string
    bankAccountNo?: string
    bankIfsc?: string
    bankAccountName?: string
    invoicePrefix?: string
    quotationPrefix?: string
    defaultGstType?: string
    currency?: string
    showPkgDetails?: boolean
    updatedAt?: Date | string
  }

  export type CompanySettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    bankAccountNo?: StringFieldUpdateOperationsInput | string
    bankIfsc?: StringFieldUpdateOperationsInput | string
    bankAccountName?: StringFieldUpdateOperationsInput | string
    invoicePrefix?: StringFieldUpdateOperationsInput | string
    quotationPrefix?: StringFieldUpdateOperationsInput | string
    defaultGstType?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    showPkgDetails?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    bankAccountNo?: StringFieldUpdateOperationsInput | string
    bankIfsc?: StringFieldUpdateOperationsInput | string
    bankAccountName?: StringFieldUpdateOperationsInput | string
    invoicePrefix?: StringFieldUpdateOperationsInput | string
    quotationPrefix?: StringFieldUpdateOperationsInput | string
    defaultGstType?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    showPkgDetails?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingCreateManyInput = {
    id?: string
    companyName?: string
    gstin?: string
    pan?: string | null
    address1?: string
    address2?: string | null
    city?: string
    state?: string
    pincode?: string
    phone?: string
    email?: string
    website?: string | null
    bankName?: string
    bankBranch?: string
    bankAccountNo?: string
    bankIfsc?: string
    bankAccountName?: string
    invoicePrefix?: string
    quotationPrefix?: string
    defaultGstType?: string
    currency?: string
    showPkgDetails?: boolean
    updatedAt?: Date | string
  }

  export type CompanySettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    bankAccountNo?: StringFieldUpdateOperationsInput | string
    bankIfsc?: StringFieldUpdateOperationsInput | string
    bankAccountName?: StringFieldUpdateOperationsInput | string
    invoicePrefix?: StringFieldUpdateOperationsInput | string
    quotationPrefix?: StringFieldUpdateOperationsInput | string
    defaultGstType?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    showPkgDetails?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    pan?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    pincode?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: StringFieldUpdateOperationsInput | string
    bankBranch?: StringFieldUpdateOperationsInput | string
    bankAccountNo?: StringFieldUpdateOperationsInput | string
    bankIfsc?: StringFieldUpdateOperationsInput | string
    bankAccountName?: StringFieldUpdateOperationsInput | string
    invoicePrefix?: StringFieldUpdateOperationsInput | string
    quotationPrefix?: StringFieldUpdateOperationsInput | string
    defaultGstType?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    showPkgDetails?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineItemCreateInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    invoice: InvoiceCreateNestedOneWithoutLineItemsInput
    product?: ProductCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineItemUncheckedCreateInput = {
    id?: string
    invoiceId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoice?: InvoiceUpdateOneRequiredWithoutLineItemsNestedInput
    product?: ProductUpdateOneWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemCreateManyInput = {
    id?: string
    invoiceId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutCreatedAuditsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutCreatedAuditsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VendorCreateInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    purchases?: PurchaseCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    purchases?: PurchaseUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchases?: PurchaseUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchases?: PurchaseUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
  }

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PurchaseCreateInput = {
    id?: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    lineItems?: PurchaseLineItemCreateNestedManyWithoutPurchaseInput
    vendor: VendorCreateNestedOneWithoutPurchasesInput
  }

  export type PurchaseUncheckedCreateInput = {
    id?: string
    vendorId: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    lineItems?: PurchaseLineItemUncheckedCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: PurchaseLineItemUpdateManyWithoutPurchaseNestedInput
    vendor?: VendorUpdateOneRequiredWithoutPurchasesNestedInput
  }

  export type PurchaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: PurchaseLineItemUncheckedUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseCreateManyInput = {
    id?: string
    vendorId: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
  }

  export type PurchaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseLineItemCreateInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    purchase: PurchaseCreateNestedOneWithoutLineItemsInput
    product?: ProductCreateNestedOneWithoutPurchaseLinesInput
  }

  export type PurchaseLineItemUncheckedCreateInput = {
    id?: string
    purchaseId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchase?: PurchaseUpdateOneRequiredWithoutLineItemsNestedInput
    product?: ProductUpdateOneWithoutPurchaseLinesNestedInput
  }

  export type PurchaseLineItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemCreateManyInput = {
    id?: string
    purchaseId: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseId?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    failedLogins?: SortOrder
    isLockedOut?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLogins?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    failedLogins?: SortOrder
    isLockedOut?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    lastLoginIp?: SortOrder
    failedLogins?: SortOrder
    isLockedOut?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLogins?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type QuotationListRelationFilter = {
    every?: QuotationWhereInput
    some?: QuotationWhereInput
    none?: QuotationWhereInput
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuotationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientOrderByRelevanceInput = {
    fields: ClientOrderByRelevanceFieldEnum | ClientOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemListRelationFilter = {
    every?: InvoiceLineItemWhereInput
    some?: InvoiceLineItemWhereInput
    none?: InvoiceLineItemWhereInput
  }

  export type QuotationLineItemListRelationFilter = {
    every?: QuotationLineItemWhereInput
    some?: QuotationLineItemWhereInput
    none?: QuotationLineItemWhereInput
  }

  export type PurchaseLineItemListRelationFilter = {
    every?: PurchaseLineItemWhereInput
    some?: PurchaseLineItemWhereInput
    none?: PurchaseLineItemWhereInput
  }

  export type InvoiceLineItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuotationLineItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PurchaseLineItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductOrderByRelevanceInput = {
    fields: ProductOrderByRelevanceFieldEnum | ProductOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    gstRate?: SortOrder
    unit?: SortOrder
    notes?: SortOrder
    pkgType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    active?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    gstRate?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    gstRate?: SortOrder
    unit?: SortOrder
    notes?: SortOrder
    pkgType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    active?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    gstRate?: SortOrder
    unit?: SortOrder
    notes?: SortOrder
    pkgType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    active?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    gstRate?: SortOrder
    purchaseRate?: SortOrder
    sellingRate?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelevanceInput = {
    fields: InvoiceOrderByRelevanceFieldEnum | InvoiceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    invoiceNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
    ewayBillUrl?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    invoiceNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
    ewayBillUrl?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    invoiceNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
    ewayBillUrl?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
  }

  export type InvoiceScalarRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type PaymentOrderByRelevanceInput = {
    fields: PaymentOrderByRelevanceFieldEnum | PaymentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    amount?: SortOrder
    paidAt?: SortOrder
    method?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    recordedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    amount?: SortOrder
    paidAt?: SortOrder
    method?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    recordedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    amount?: SortOrder
    paidAt?: SortOrder
    method?: SortOrder
    reference?: SortOrder
    notes?: SortOrder
    recordedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type QuotationOrderByRelevanceInput = {
    fields: QuotationOrderByRelevanceFieldEnum | QuotationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QuotationCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    quotationNo?: SortOrder
    date?: SortOrder
    validUntil?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    status?: SortOrder
    convertedInvoiceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
  }

  export type QuotationAvgOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
  }

  export type QuotationMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    quotationNo?: SortOrder
    date?: SortOrder
    validUntil?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    status?: SortOrder
    convertedInvoiceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
  }

  export type QuotationMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    sequenceNumber?: SortOrder
    quotationNo?: SortOrder
    date?: SortOrder
    validUntil?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    status?: SortOrder
    convertedInvoiceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    billingAddress1?: SortOrder
    billingAddress2?: SortOrder
    billingGst?: SortOrder
    billingName?: SortOrder
    billingPhone?: SortOrder
    billingPinCode?: SortOrder
    billingState?: SortOrder
    shippingAddress1?: SortOrder
    shippingAddress2?: SortOrder
    shippingName?: SortOrder
    shippingPinCode?: SortOrder
    shippingSameAsBilling?: SortOrder
    shippingState?: SortOrder
  }

  export type QuotationSumOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type QuotationScalarRelationFilter = {
    is?: QuotationWhereInput
    isNot?: QuotationWhereInput
  }

  export type ProductNullableScalarRelationFilter = {
    is?: ProductWhereInput | null
    isNot?: ProductWhereInput | null
  }

  export type QuotationLineItemOrderByRelevanceInput = {
    fields: QuotationLineItemOrderByRelevanceFieldEnum | QuotationLineItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QuotationLineItemCountOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type QuotationLineItemAvgOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type QuotationLineItemMaxOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type QuotationLineItemMinOrderByAggregateInput = {
    id?: SortOrder
    quotationId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type QuotationLineItemSumOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CompanySettingOrderByRelevanceInput = {
    fields: CompanySettingOrderByRelevanceFieldEnum | CompanySettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CompanySettingCountOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    gstin?: SortOrder
    pan?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    website?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    bankAccountNo?: SortOrder
    bankIfsc?: SortOrder
    bankAccountName?: SortOrder
    invoicePrefix?: SortOrder
    quotationPrefix?: SortOrder
    defaultGstType?: SortOrder
    currency?: SortOrder
    showPkgDetails?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanySettingMaxOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    gstin?: SortOrder
    pan?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    website?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    bankAccountNo?: SortOrder
    bankIfsc?: SortOrder
    bankAccountName?: SortOrder
    invoicePrefix?: SortOrder
    quotationPrefix?: SortOrder
    defaultGstType?: SortOrder
    currency?: SortOrder
    showPkgDetails?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanySettingMinOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    gstin?: SortOrder
    pan?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    website?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    bankAccountNo?: SortOrder
    bankIfsc?: SortOrder
    bankAccountName?: SortOrder
    invoicePrefix?: SortOrder
    quotationPrefix?: SortOrder
    defaultGstType?: SortOrder
    currency?: SortOrder
    showPkgDetails?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceLineItemOrderByRelevanceInput = {
    fields: InvoiceLineItemOrderByRelevanceFieldEnum | InvoiceLineItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InvoiceLineItemCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type InvoiceLineItemAvgOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type InvoiceLineItemMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type InvoiceLineItemMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type InvoiceLineItemSumOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AuditLogOrderByRelevanceInput = {
    fields: AuditLogOrderByRelevanceFieldEnum | AuditLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchaseListRelationFilter = {
    every?: PurchaseWhereInput
    some?: PurchaseWhereInput
    none?: PurchaseWhereInput
  }

  export type PurchaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorOrderByRelevanceInput = {
    fields: VendorOrderByRelevanceFieldEnum | VendorOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gst?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address1?: SortOrder
    address2?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    pinCode?: SortOrder
    active?: SortOrder
  }

  export type VendorScalarRelationFilter = {
    is?: VendorWhereInput
    isNot?: VendorWhereInput
  }

  export type PurchaseOrderByRelevanceInput = {
    fields: PurchaseOrderByRelevanceFieldEnum | PurchaseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PurchaseCountOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    sequenceNumber?: SortOrder
    purchaseNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    ewayBillUrl?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
  }

  export type PurchaseAvgOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
  }

  export type PurchaseMaxOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    sequenceNumber?: SortOrder
    purchaseNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    ewayBillUrl?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
  }

  export type PurchaseMinOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    sequenceNumber?: SortOrder
    purchaseNo?: SortOrder
    date?: SortOrder
    gstType?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
    status?: SortOrder
    ewayBill?: SortOrder
    ewayBillUrl?: SortOrder
    vehicleNo?: SortOrder
    dispatchedThrough?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    createdById?: SortOrder
    notes?: SortOrder
  }

  export type PurchaseSumOrderByAggregateInput = {
    sequenceNumber?: SortOrder
    subTotal?: SortOrder
    taxTotal?: SortOrder
    grandTotal?: SortOrder
    amountPaid?: SortOrder
  }

  export type PurchaseScalarRelationFilter = {
    is?: PurchaseWhereInput
    isNot?: PurchaseWhereInput
  }

  export type PurchaseLineItemOrderByRelevanceInput = {
    fields: PurchaseLineItemOrderByRelevanceFieldEnum | PurchaseLineItemOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PurchaseLineItemCountOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type PurchaseLineItemAvgOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type PurchaseLineItemMaxOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type PurchaseLineItemMinOrderByAggregateInput = {
    id?: SortOrder
    purchaseId?: SortOrder
    productId?: SortOrder
    description?: SortOrder
    hsn?: SortOrder
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    unit?: SortOrder
    pkgCount?: SortOrder
    pkgType?: SortOrder
    totalAmount?: SortOrder
  }

  export type PurchaseLineItemSumOrderByAggregateInput = {
    qty?: SortOrder
    rate?: SortOrder
    taxPercent?: SortOrder
    taxAmount?: SortOrder
    pkgCount?: SortOrder
    totalAmount?: SortOrder
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type InvoiceCreateNestedManyWithoutClientInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type QuotationCreateNestedManyWithoutClientInput = {
    create?: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput> | QuotationCreateWithoutClientInput[] | QuotationUncheckedCreateWithoutClientInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutClientInput | QuotationCreateOrConnectWithoutClientInput[]
    createMany?: QuotationCreateManyClientInputEnvelope
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type QuotationUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput> | QuotationCreateWithoutClientInput[] | QuotationUncheckedCreateWithoutClientInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutClientInput | QuotationCreateOrConnectWithoutClientInput[]
    createMany?: QuotationCreateManyClientInputEnvelope
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
  }

  export type InvoiceUpdateManyWithoutClientNestedInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutClientInput | InvoiceUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutClientInput | InvoiceUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutClientInput | InvoiceUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type QuotationUpdateManyWithoutClientNestedInput = {
    create?: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput> | QuotationCreateWithoutClientInput[] | QuotationUncheckedCreateWithoutClientInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutClientInput | QuotationCreateOrConnectWithoutClientInput[]
    upsert?: QuotationUpsertWithWhereUniqueWithoutClientInput | QuotationUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: QuotationCreateManyClientInputEnvelope
    set?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    disconnect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    delete?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    update?: QuotationUpdateWithWhereUniqueWithoutClientInput | QuotationUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: QuotationUpdateManyWithWhereWithoutClientInput | QuotationUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput> | InvoiceCreateWithoutClientInput[] | InvoiceUncheckedCreateWithoutClientInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutClientInput | InvoiceCreateOrConnectWithoutClientInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutClientInput | InvoiceUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: InvoiceCreateManyClientInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutClientInput | InvoiceUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutClientInput | InvoiceUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type QuotationUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput> | QuotationCreateWithoutClientInput[] | QuotationUncheckedCreateWithoutClientInput[]
    connectOrCreate?: QuotationCreateOrConnectWithoutClientInput | QuotationCreateOrConnectWithoutClientInput[]
    upsert?: QuotationUpsertWithWhereUniqueWithoutClientInput | QuotationUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: QuotationCreateManyClientInputEnvelope
    set?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    disconnect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    delete?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    connect?: QuotationWhereUniqueInput | QuotationWhereUniqueInput[]
    update?: QuotationUpdateWithWhereUniqueWithoutClientInput | QuotationUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: QuotationUpdateManyWithWhereWithoutClientInput | QuotationUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
  }

  export type InvoiceLineItemCreateNestedManyWithoutProductInput = {
    create?: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput> | InvoiceLineItemCreateWithoutProductInput[] | InvoiceLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutProductInput | InvoiceLineItemCreateOrConnectWithoutProductInput[]
    createMany?: InvoiceLineItemCreateManyProductInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type QuotationLineItemCreateNestedManyWithoutProductInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type PurchaseLineItemCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput> | PurchaseLineItemCreateWithoutProductInput[] | PurchaseLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutProductInput | PurchaseLineItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseLineItemCreateManyProductInputEnvelope
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
  }

  export type InvoiceLineItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput> | InvoiceLineItemCreateWithoutProductInput[] | InvoiceLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutProductInput | InvoiceLineItemCreateOrConnectWithoutProductInput[]
    createMany?: InvoiceLineItemCreateManyProductInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type QuotationLineItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type PurchaseLineItemUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput> | PurchaseLineItemCreateWithoutProductInput[] | PurchaseLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutProductInput | PurchaseLineItemCreateOrConnectWithoutProductInput[]
    createMany?: PurchaseLineItemCreateManyProductInputEnvelope
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput> | InvoiceLineItemCreateWithoutProductInput[] | InvoiceLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutProductInput | InvoiceLineItemCreateOrConnectWithoutProductInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutProductInput | InvoiceLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InvoiceLineItemCreateManyProductInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutProductInput | InvoiceLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutProductInput | InvoiceLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type QuotationLineItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutProductInput | QuotationLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutProductInput | QuotationLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutProductInput | QuotationLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type PurchaseLineItemUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput> | PurchaseLineItemCreateWithoutProductInput[] | PurchaseLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutProductInput | PurchaseLineItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseLineItemUpsertWithWhereUniqueWithoutProductInput | PurchaseLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseLineItemCreateManyProductInputEnvelope
    set?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    disconnect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    delete?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    update?: PurchaseLineItemUpdateWithWhereUniqueWithoutProductInput | PurchaseLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseLineItemUpdateManyWithWhereWithoutProductInput | PurchaseLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput> | InvoiceLineItemCreateWithoutProductInput[] | InvoiceLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutProductInput | InvoiceLineItemCreateOrConnectWithoutProductInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutProductInput | InvoiceLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: InvoiceLineItemCreateManyProductInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutProductInput | InvoiceLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutProductInput | InvoiceLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput> | QuotationLineItemCreateWithoutProductInput[] | QuotationLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutProductInput | QuotationLineItemCreateOrConnectWithoutProductInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutProductInput | QuotationLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: QuotationLineItemCreateManyProductInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutProductInput | QuotationLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutProductInput | QuotationLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type PurchaseLineItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput> | PurchaseLineItemCreateWithoutProductInput[] | PurchaseLineItemUncheckedCreateWithoutProductInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutProductInput | PurchaseLineItemCreateOrConnectWithoutProductInput[]
    upsert?: PurchaseLineItemUpsertWithWhereUniqueWithoutProductInput | PurchaseLineItemUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: PurchaseLineItemCreateManyProductInputEnvelope
    set?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    disconnect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    delete?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    update?: PurchaseLineItemUpdateWithWhereUniqueWithoutProductInput | PurchaseLineItemUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: PurchaseLineItemUpdateManyWithWhereWithoutProductInput | PurchaseLineItemUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
  }

  export type InvoiceLineItemCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type ClientCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutInvoicesInput
    connect?: ClientWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type InvoiceLineItemUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type ClientUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutInvoicesInput
    upsert?: ClientUpsertWithoutInvoicesInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutInvoicesInput, ClientUpdateWithoutInvoicesInput>, ClientUncheckedUpdateWithoutInvoicesInput>
  }

  export type PaymentUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutInvoiceInput | PaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutInvoiceInput | PaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutInvoiceInput | PaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput> | InvoiceLineItemCreateWithoutInvoiceInput[] | InvoiceLineItemUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineItemCreateOrConnectWithoutInvoiceInput | InvoiceLineItemCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineItemCreateManyInvoiceInputEnvelope
    set?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    disconnect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    delete?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    connect?: InvoiceLineItemWhereUniqueInput | InvoiceLineItemWhereUniqueInput[]
    update?: InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput> | PaymentCreateWithoutInvoiceInput[] | PaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutInvoiceInput | PaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutInvoiceInput | PaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: PaymentCreateManyInvoiceInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutInvoiceInput | PaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutInvoiceInput | PaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutPaymentsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutPaymentsInput
    upsert?: InvoiceUpsertWithoutPaymentsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutPaymentsInput, InvoiceUpdateWithoutPaymentsInput>, InvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type QuotationLineItemCreateNestedManyWithoutQuotationInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type ClientCreateNestedOneWithoutQuotationsInput = {
    create?: XOR<ClientCreateWithoutQuotationsInput, ClientUncheckedCreateWithoutQuotationsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutQuotationsInput
    connect?: ClientWhereUniqueInput
  }

  export type QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
  }

  export type QuotationLineItemUpdateManyWithoutQuotationNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutQuotationInput | QuotationLineItemUpdateManyWithWhereWithoutQuotationInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type ClientUpdateOneRequiredWithoutQuotationsNestedInput = {
    create?: XOR<ClientCreateWithoutQuotationsInput, ClientUncheckedCreateWithoutQuotationsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutQuotationsInput
    upsert?: ClientUpsertWithoutQuotationsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutQuotationsInput, ClientUpdateWithoutQuotationsInput>, ClientUncheckedUpdateWithoutQuotationsInput>
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput = {
    create?: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput> | QuotationLineItemCreateWithoutQuotationInput[] | QuotationLineItemUncheckedCreateWithoutQuotationInput[]
    connectOrCreate?: QuotationLineItemCreateOrConnectWithoutQuotationInput | QuotationLineItemCreateOrConnectWithoutQuotationInput[]
    upsert?: QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput[]
    createMany?: QuotationLineItemCreateManyQuotationInputEnvelope
    set?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    disconnect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    delete?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    connect?: QuotationLineItemWhereUniqueInput | QuotationLineItemWhereUniqueInput[]
    update?: QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput | QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput[]
    updateMany?: QuotationLineItemUpdateManyWithWhereWithoutQuotationInput | QuotationLineItemUpdateManyWithWhereWithoutQuotationInput[]
    deleteMany?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
  }

  export type QuotationCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutLineItemsInput
    connect?: QuotationWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutQuotationLinesInput = {
    create?: XOR<ProductCreateWithoutQuotationLinesInput, ProductUncheckedCreateWithoutQuotationLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutQuotationLinesInput
    connect?: ProductWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type QuotationUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: QuotationCreateOrConnectWithoutLineItemsInput
    upsert?: QuotationUpsertWithoutLineItemsInput
    connect?: QuotationWhereUniqueInput
    update?: XOR<XOR<QuotationUpdateToOneWithWhereWithoutLineItemsInput, QuotationUpdateWithoutLineItemsInput>, QuotationUncheckedUpdateWithoutLineItemsInput>
  }

  export type ProductUpdateOneWithoutQuotationLinesNestedInput = {
    create?: XOR<ProductCreateWithoutQuotationLinesInput, ProductUncheckedCreateWithoutQuotationLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutQuotationLinesInput
    upsert?: ProductUpsertWithoutQuotationLinesInput
    disconnect?: ProductWhereInput | boolean
    delete?: ProductWhereInput | boolean
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutQuotationLinesInput, ProductUpdateWithoutQuotationLinesInput>, ProductUncheckedUpdateWithoutQuotationLinesInput>
  }

  export type InvoiceCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLineItemsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutInvoiceLinesInput = {
    create?: XOR<ProductCreateWithoutInvoiceLinesInput, ProductUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInvoiceLinesInput
    connect?: ProductWhereUniqueInput
  }

  export type InvoiceUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutLineItemsInput
    upsert?: InvoiceUpsertWithoutLineItemsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutLineItemsInput, InvoiceUpdateWithoutLineItemsInput>, InvoiceUncheckedUpdateWithoutLineItemsInput>
  }

  export type ProductUpdateOneWithoutInvoiceLinesNestedInput = {
    create?: XOR<ProductCreateWithoutInvoiceLinesInput, ProductUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutInvoiceLinesInput
    upsert?: ProductUpsertWithoutInvoiceLinesInput
    disconnect?: ProductWhereInput | boolean
    delete?: ProductWhereInput | boolean
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutInvoiceLinesInput, ProductUpdateWithoutInvoiceLinesInput>, ProductUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type UserCreateNestedOneWithoutCreatedAuditsInput = {
    create?: XOR<UserCreateWithoutCreatedAuditsInput, UserUncheckedCreateWithoutCreatedAuditsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedAuditsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutCreatedAuditsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedAuditsInput, UserUncheckedCreateWithoutCreatedAuditsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedAuditsInput
    upsert?: UserUpsertWithoutCreatedAuditsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedAuditsInput, UserUpdateWithoutCreatedAuditsInput>, UserUncheckedUpdateWithoutCreatedAuditsInput>
  }

  export type PurchaseCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput> | PurchaseCreateWithoutVendorInput[] | PurchaseUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutVendorInput | PurchaseCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseCreateManyVendorInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type PurchaseUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput> | PurchaseCreateWithoutVendorInput[] | PurchaseUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutVendorInput | PurchaseCreateOrConnectWithoutVendorInput[]
    createMany?: PurchaseCreateManyVendorInputEnvelope
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
  }

  export type PurchaseUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput> | PurchaseCreateWithoutVendorInput[] | PurchaseUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutVendorInput | PurchaseCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutVendorInput | PurchaseUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseCreateManyVendorInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutVendorInput | PurchaseUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutVendorInput | PurchaseUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type PurchaseUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput> | PurchaseCreateWithoutVendorInput[] | PurchaseUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: PurchaseCreateOrConnectWithoutVendorInput | PurchaseCreateOrConnectWithoutVendorInput[]
    upsert?: PurchaseUpsertWithWhereUniqueWithoutVendorInput | PurchaseUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: PurchaseCreateManyVendorInputEnvelope
    set?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    disconnect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    delete?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    connect?: PurchaseWhereUniqueInput | PurchaseWhereUniqueInput[]
    update?: PurchaseUpdateWithWhereUniqueWithoutVendorInput | PurchaseUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: PurchaseUpdateManyWithWhereWithoutVendorInput | PurchaseUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
  }

  export type PurchaseLineItemCreateNestedManyWithoutPurchaseInput = {
    create?: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput> | PurchaseLineItemCreateWithoutPurchaseInput[] | PurchaseLineItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutPurchaseInput | PurchaseLineItemCreateOrConnectWithoutPurchaseInput[]
    createMany?: PurchaseLineItemCreateManyPurchaseInputEnvelope
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
  }

  export type VendorCreateNestedOneWithoutPurchasesInput = {
    create?: XOR<VendorCreateWithoutPurchasesInput, VendorUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchasesInput
    connect?: VendorWhereUniqueInput
  }

  export type PurchaseLineItemUncheckedCreateNestedManyWithoutPurchaseInput = {
    create?: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput> | PurchaseLineItemCreateWithoutPurchaseInput[] | PurchaseLineItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutPurchaseInput | PurchaseLineItemCreateOrConnectWithoutPurchaseInput[]
    createMany?: PurchaseLineItemCreateManyPurchaseInputEnvelope
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
  }

  export type PurchaseLineItemUpdateManyWithoutPurchaseNestedInput = {
    create?: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput> | PurchaseLineItemCreateWithoutPurchaseInput[] | PurchaseLineItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutPurchaseInput | PurchaseLineItemCreateOrConnectWithoutPurchaseInput[]
    upsert?: PurchaseLineItemUpsertWithWhereUniqueWithoutPurchaseInput | PurchaseLineItemUpsertWithWhereUniqueWithoutPurchaseInput[]
    createMany?: PurchaseLineItemCreateManyPurchaseInputEnvelope
    set?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    disconnect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    delete?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    update?: PurchaseLineItemUpdateWithWhereUniqueWithoutPurchaseInput | PurchaseLineItemUpdateWithWhereUniqueWithoutPurchaseInput[]
    updateMany?: PurchaseLineItemUpdateManyWithWhereWithoutPurchaseInput | PurchaseLineItemUpdateManyWithWhereWithoutPurchaseInput[]
    deleteMany?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
  }

  export type VendorUpdateOneRequiredWithoutPurchasesNestedInput = {
    create?: XOR<VendorCreateWithoutPurchasesInput, VendorUncheckedCreateWithoutPurchasesInput>
    connectOrCreate?: VendorCreateOrConnectWithoutPurchasesInput
    upsert?: VendorUpsertWithoutPurchasesInput
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutPurchasesInput, VendorUpdateWithoutPurchasesInput>, VendorUncheckedUpdateWithoutPurchasesInput>
  }

  export type PurchaseLineItemUncheckedUpdateManyWithoutPurchaseNestedInput = {
    create?: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput> | PurchaseLineItemCreateWithoutPurchaseInput[] | PurchaseLineItemUncheckedCreateWithoutPurchaseInput[]
    connectOrCreate?: PurchaseLineItemCreateOrConnectWithoutPurchaseInput | PurchaseLineItemCreateOrConnectWithoutPurchaseInput[]
    upsert?: PurchaseLineItemUpsertWithWhereUniqueWithoutPurchaseInput | PurchaseLineItemUpsertWithWhereUniqueWithoutPurchaseInput[]
    createMany?: PurchaseLineItemCreateManyPurchaseInputEnvelope
    set?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    disconnect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    delete?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    connect?: PurchaseLineItemWhereUniqueInput | PurchaseLineItemWhereUniqueInput[]
    update?: PurchaseLineItemUpdateWithWhereUniqueWithoutPurchaseInput | PurchaseLineItemUpdateWithWhereUniqueWithoutPurchaseInput[]
    updateMany?: PurchaseLineItemUpdateManyWithWhereWithoutPurchaseInput | PurchaseLineItemUpdateManyWithWhereWithoutPurchaseInput[]
    deleteMany?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
  }

  export type PurchaseCreateNestedOneWithoutLineItemsInput = {
    create?: XOR<PurchaseCreateWithoutLineItemsInput, PurchaseUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: PurchaseCreateOrConnectWithoutLineItemsInput
    connect?: PurchaseWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutPurchaseLinesInput = {
    create?: XOR<ProductCreateWithoutPurchaseLinesInput, ProductUncheckedCreateWithoutPurchaseLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseLinesInput
    connect?: ProductWhereUniqueInput
  }

  export type PurchaseUpdateOneRequiredWithoutLineItemsNestedInput = {
    create?: XOR<PurchaseCreateWithoutLineItemsInput, PurchaseUncheckedCreateWithoutLineItemsInput>
    connectOrCreate?: PurchaseCreateOrConnectWithoutLineItemsInput
    upsert?: PurchaseUpsertWithoutLineItemsInput
    connect?: PurchaseWhereUniqueInput
    update?: XOR<XOR<PurchaseUpdateToOneWithWhereWithoutLineItemsInput, PurchaseUpdateWithoutLineItemsInput>, PurchaseUncheckedUpdateWithoutLineItemsInput>
  }

  export type ProductUpdateOneWithoutPurchaseLinesNestedInput = {
    create?: XOR<ProductCreateWithoutPurchaseLinesInput, ProductUncheckedCreateWithoutPurchaseLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutPurchaseLinesInput
    upsert?: ProductUpsertWithoutPurchaseLinesInput
    disconnect?: ProductWhereInput | boolean
    delete?: ProductWhereInput | boolean
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutPurchaseLinesInput, ProductUpdateWithoutPurchaseLinesInput>, ProductUncheckedUpdateWithoutPurchaseLinesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type InvoiceCreateWithoutClientInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutClientInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput>
  }

  export type InvoiceCreateManyClientInputEnvelope = {
    data: InvoiceCreateManyClientInput | InvoiceCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type QuotationCreateWithoutClientInput = {
    id?: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    lineItems?: QuotationLineItemCreateNestedManyWithoutQuotationInput
  }

  export type QuotationUncheckedCreateWithoutClientInput = {
    id?: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    lineItems?: QuotationLineItemUncheckedCreateNestedManyWithoutQuotationInput
  }

  export type QuotationCreateOrConnectWithoutClientInput = {
    where: QuotationWhereUniqueInput
    create: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput>
  }

  export type QuotationCreateManyClientInputEnvelope = {
    data: QuotationCreateManyClientInput | QuotationCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceUpsertWithWhereUniqueWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutClientInput, InvoiceUncheckedUpdateWithoutClientInput>
    create: XOR<InvoiceCreateWithoutClientInput, InvoiceUncheckedCreateWithoutClientInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutClientInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutClientInput, InvoiceUncheckedUpdateWithoutClientInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutClientInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutClientInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    clientId?: StringFilter<"Invoice"> | string
    sequenceNumber?: IntFilter<"Invoice"> | number
    invoiceNo?: StringFilter<"Invoice"> | string
    date?: DateTimeFilter<"Invoice"> | Date | string
    gstType?: StringFilter<"Invoice"> | string
    subTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Invoice"> | string
    ewayBill?: StringNullableFilter<"Invoice"> | string | null
    vehicleNo?: StringNullableFilter<"Invoice"> | string | null
    dispatchedThrough?: StringNullableFilter<"Invoice"> | string | null
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    createdById?: StringNullableFilter<"Invoice"> | string | null
    notes?: StringNullableFilter<"Invoice"> | string | null
    billingAddress1?: StringNullableFilter<"Invoice"> | string | null
    billingAddress2?: StringNullableFilter<"Invoice"> | string | null
    billingGst?: StringNullableFilter<"Invoice"> | string | null
    billingName?: StringNullableFilter<"Invoice"> | string | null
    billingPhone?: StringNullableFilter<"Invoice"> | string | null
    billingPinCode?: StringNullableFilter<"Invoice"> | string | null
    billingState?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress1?: StringNullableFilter<"Invoice"> | string | null
    shippingAddress2?: StringNullableFilter<"Invoice"> | string | null
    shippingName?: StringNullableFilter<"Invoice"> | string | null
    shippingPinCode?: StringNullableFilter<"Invoice"> | string | null
    shippingSameAsBilling?: BoolFilter<"Invoice"> | boolean
    shippingState?: StringNullableFilter<"Invoice"> | string | null
    ewayBillUrl?: StringNullableFilter<"Invoice"> | string | null
  }

  export type QuotationUpsertWithWhereUniqueWithoutClientInput = {
    where: QuotationWhereUniqueInput
    update: XOR<QuotationUpdateWithoutClientInput, QuotationUncheckedUpdateWithoutClientInput>
    create: XOR<QuotationCreateWithoutClientInput, QuotationUncheckedCreateWithoutClientInput>
  }

  export type QuotationUpdateWithWhereUniqueWithoutClientInput = {
    where: QuotationWhereUniqueInput
    data: XOR<QuotationUpdateWithoutClientInput, QuotationUncheckedUpdateWithoutClientInput>
  }

  export type QuotationUpdateManyWithWhereWithoutClientInput = {
    where: QuotationScalarWhereInput
    data: XOR<QuotationUpdateManyMutationInput, QuotationUncheckedUpdateManyWithoutClientInput>
  }

  export type QuotationScalarWhereInput = {
    AND?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
    OR?: QuotationScalarWhereInput[]
    NOT?: QuotationScalarWhereInput | QuotationScalarWhereInput[]
    id?: StringFilter<"Quotation"> | string
    clientId?: StringFilter<"Quotation"> | string
    sequenceNumber?: IntFilter<"Quotation"> | number
    quotationNo?: StringFilter<"Quotation"> | string
    date?: DateTimeFilter<"Quotation"> | Date | string
    validUntil?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    gstType?: StringFilter<"Quotation"> | string
    subTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Quotation"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Quotation"> | string
    convertedInvoiceId?: StringNullableFilter<"Quotation"> | string | null
    notes?: StringNullableFilter<"Quotation"> | string | null
    createdAt?: DateTimeFilter<"Quotation"> | Date | string
    updatedAt?: DateTimeFilter<"Quotation"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Quotation"> | Date | string | null
    createdById?: StringNullableFilter<"Quotation"> | string | null
    billingAddress1?: StringNullableFilter<"Quotation"> | string | null
    billingAddress2?: StringNullableFilter<"Quotation"> | string | null
    billingGst?: StringNullableFilter<"Quotation"> | string | null
    billingName?: StringNullableFilter<"Quotation"> | string | null
    billingPhone?: StringNullableFilter<"Quotation"> | string | null
    billingPinCode?: StringNullableFilter<"Quotation"> | string | null
    billingState?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress1?: StringNullableFilter<"Quotation"> | string | null
    shippingAddress2?: StringNullableFilter<"Quotation"> | string | null
    shippingName?: StringNullableFilter<"Quotation"> | string | null
    shippingPinCode?: StringNullableFilter<"Quotation"> | string | null
    shippingSameAsBilling?: BoolFilter<"Quotation"> | boolean
    shippingState?: StringNullableFilter<"Quotation"> | string | null
  }

  export type InvoiceLineItemCreateWithoutProductInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    invoice: InvoiceCreateNestedOneWithoutLineItemsInput
  }

  export type InvoiceLineItemUncheckedCreateWithoutProductInput = {
    id?: string
    invoiceId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemCreateOrConnectWithoutProductInput = {
    where: InvoiceLineItemWhereUniqueInput
    create: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput>
  }

  export type InvoiceLineItemCreateManyProductInputEnvelope = {
    data: InvoiceLineItemCreateManyProductInput | InvoiceLineItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type QuotationLineItemCreateWithoutProductInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    quotation: QuotationCreateNestedOneWithoutLineItemsInput
  }

  export type QuotationLineItemUncheckedCreateWithoutProductInput = {
    id?: string
    quotationId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateOrConnectWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    create: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput>
  }

  export type QuotationLineItemCreateManyProductInputEnvelope = {
    data: QuotationLineItemCreateManyProductInput | QuotationLineItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseLineItemCreateWithoutProductInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    purchase: PurchaseCreateNestedOneWithoutLineItemsInput
  }

  export type PurchaseLineItemUncheckedCreateWithoutProductInput = {
    id?: string
    purchaseId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemCreateOrConnectWithoutProductInput = {
    where: PurchaseLineItemWhereUniqueInput
    create: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseLineItemCreateManyProductInputEnvelope = {
    data: PurchaseLineItemCreateManyProductInput | PurchaseLineItemCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceLineItemUpsertWithWhereUniqueWithoutProductInput = {
    where: InvoiceLineItemWhereUniqueInput
    update: XOR<InvoiceLineItemUpdateWithoutProductInput, InvoiceLineItemUncheckedUpdateWithoutProductInput>
    create: XOR<InvoiceLineItemCreateWithoutProductInput, InvoiceLineItemUncheckedCreateWithoutProductInput>
  }

  export type InvoiceLineItemUpdateWithWhereUniqueWithoutProductInput = {
    where: InvoiceLineItemWhereUniqueInput
    data: XOR<InvoiceLineItemUpdateWithoutProductInput, InvoiceLineItemUncheckedUpdateWithoutProductInput>
  }

  export type InvoiceLineItemUpdateManyWithWhereWithoutProductInput = {
    where: InvoiceLineItemScalarWhereInput
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyWithoutProductInput>
  }

  export type InvoiceLineItemScalarWhereInput = {
    AND?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
    OR?: InvoiceLineItemScalarWhereInput[]
    NOT?: InvoiceLineItemScalarWhereInput | InvoiceLineItemScalarWhereInput[]
    id?: StringFilter<"InvoiceLineItem"> | string
    invoiceId?: StringFilter<"InvoiceLineItem"> | string
    productId?: StringNullableFilter<"InvoiceLineItem"> | string | null
    description?: StringFilter<"InvoiceLineItem"> | string
    hsn?: StringNullableFilter<"InvoiceLineItem"> | string | null
    qty?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"InvoiceLineItem"> | string
    pkgCount?: IntNullableFilter<"InvoiceLineItem"> | number | null
    pkgType?: StringNullableFilter<"InvoiceLineItem"> | string | null
    totalAmount?: DecimalFilter<"InvoiceLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpsertWithWhereUniqueWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    update: XOR<QuotationLineItemUpdateWithoutProductInput, QuotationLineItemUncheckedUpdateWithoutProductInput>
    create: XOR<QuotationLineItemCreateWithoutProductInput, QuotationLineItemUncheckedCreateWithoutProductInput>
  }

  export type QuotationLineItemUpdateWithWhereUniqueWithoutProductInput = {
    where: QuotationLineItemWhereUniqueInput
    data: XOR<QuotationLineItemUpdateWithoutProductInput, QuotationLineItemUncheckedUpdateWithoutProductInput>
  }

  export type QuotationLineItemUpdateManyWithWhereWithoutProductInput = {
    where: QuotationLineItemScalarWhereInput
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyWithoutProductInput>
  }

  export type QuotationLineItemScalarWhereInput = {
    AND?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
    OR?: QuotationLineItemScalarWhereInput[]
    NOT?: QuotationLineItemScalarWhereInput | QuotationLineItemScalarWhereInput[]
    id?: StringFilter<"QuotationLineItem"> | string
    quotationId?: StringFilter<"QuotationLineItem"> | string
    productId?: StringNullableFilter<"QuotationLineItem"> | string | null
    description?: StringFilter<"QuotationLineItem"> | string
    hsn?: StringNullableFilter<"QuotationLineItem"> | string | null
    qty?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"QuotationLineItem"> | string
    pkgCount?: IntNullableFilter<"QuotationLineItem"> | number | null
    pkgType?: StringNullableFilter<"QuotationLineItem"> | string | null
    totalAmount?: DecimalFilter<"QuotationLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUpsertWithWhereUniqueWithoutProductInput = {
    where: PurchaseLineItemWhereUniqueInput
    update: XOR<PurchaseLineItemUpdateWithoutProductInput, PurchaseLineItemUncheckedUpdateWithoutProductInput>
    create: XOR<PurchaseLineItemCreateWithoutProductInput, PurchaseLineItemUncheckedCreateWithoutProductInput>
  }

  export type PurchaseLineItemUpdateWithWhereUniqueWithoutProductInput = {
    where: PurchaseLineItemWhereUniqueInput
    data: XOR<PurchaseLineItemUpdateWithoutProductInput, PurchaseLineItemUncheckedUpdateWithoutProductInput>
  }

  export type PurchaseLineItemUpdateManyWithWhereWithoutProductInput = {
    where: PurchaseLineItemScalarWhereInput
    data: XOR<PurchaseLineItemUpdateManyMutationInput, PurchaseLineItemUncheckedUpdateManyWithoutProductInput>
  }

  export type PurchaseLineItemScalarWhereInput = {
    AND?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
    OR?: PurchaseLineItemScalarWhereInput[]
    NOT?: PurchaseLineItemScalarWhereInput | PurchaseLineItemScalarWhereInput[]
    id?: StringFilter<"PurchaseLineItem"> | string
    purchaseId?: StringFilter<"PurchaseLineItem"> | string
    productId?: StringNullableFilter<"PurchaseLineItem"> | string | null
    description?: StringFilter<"PurchaseLineItem"> | string
    hsn?: StringNullableFilter<"PurchaseLineItem"> | string | null
    qty?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    rate?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
    unit?: StringFilter<"PurchaseLineItem"> | string
    pkgCount?: IntNullableFilter<"PurchaseLineItem"> | number | null
    pkgType?: StringNullableFilter<"PurchaseLineItem"> | string | null
    totalAmount?: DecimalFilter<"PurchaseLineItem"> | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemCreateWithoutInvoiceInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    product?: ProductCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineItemUncheckedCreateWithoutInvoiceInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    create: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineItemCreateManyInvoiceInputEnvelope = {
    data: InvoiceLineItemCreateManyInvoiceInput | InvoiceLineItemCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type ClientCreateWithoutInvoicesInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    quotations?: QuotationCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutInvoicesInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    quotations?: QuotationUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutInvoicesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
  }

  export type PaymentCreateWithoutInvoiceInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutInvoiceInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type PaymentCreateManyInvoiceInputEnvelope = {
    data: PaymentCreateManyInvoiceInput | PaymentCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceLineItemUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    update: XOR<InvoiceLineItemUpdateWithoutInvoiceInput, InvoiceLineItemUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceLineItemCreateWithoutInvoiceInput, InvoiceLineItemUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineItemUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineItemWhereUniqueInput
    data: XOR<InvoiceLineItemUpdateWithoutInvoiceInput, InvoiceLineItemUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceLineItemUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceLineItemScalarWhereInput
    data: XOR<InvoiceLineItemUpdateManyMutationInput, InvoiceLineItemUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type ClientUpsertWithoutInvoicesInput = {
    update: XOR<ClientUpdateWithoutInvoicesInput, ClientUncheckedUpdateWithoutInvoicesInput>
    create: XOR<ClientCreateWithoutInvoicesInput, ClientUncheckedCreateWithoutInvoicesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutInvoicesInput, ClientUncheckedUpdateWithoutInvoicesInput>
  }

  export type ClientUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    quotations?: QuotationUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    quotations?: QuotationUncheckedUpdateManyWithoutClientNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutInvoiceInput, PaymentUncheckedUpdateWithoutInvoiceInput>
    create: XOR<PaymentCreateWithoutInvoiceInput, PaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutInvoiceInput, PaymentUncheckedUpdateWithoutInvoiceInput>
  }

  export type PaymentUpdateManyWithWhereWithoutInvoiceInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    invoiceId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFilter<"Payment"> | Date | string
    method?: StringFilter<"Payment"> | string
    reference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    recordedBy?: StringNullableFilter<"Payment"> | string | null
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
  }

  export type InvoiceCreateWithoutPaymentsInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemCreateNestedManyWithoutInvoiceInput
    client: ClientCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateWithoutPaymentsInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    lineItems?: InvoiceLineItemUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutPaymentsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
  }

  export type InvoiceUpsertWithoutPaymentsInput = {
    update: XOR<InvoiceUpdateWithoutPaymentsInput, InvoiceUncheckedUpdateWithoutPaymentsInput>
    create: XOR<InvoiceCreateWithoutPaymentsInput, InvoiceUncheckedCreateWithoutPaymentsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutPaymentsInput, InvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type InvoiceUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    client?: ClientUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type QuotationLineItemCreateWithoutQuotationInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    product?: ProductCreateNestedOneWithoutQuotationLinesInput
  }

  export type QuotationLineItemUncheckedCreateWithoutQuotationInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateOrConnectWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    create: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput>
  }

  export type QuotationLineItemCreateManyQuotationInputEnvelope = {
    data: QuotationLineItemCreateManyQuotationInput | QuotationLineItemCreateManyQuotationInput[]
    skipDuplicates?: boolean
  }

  export type ClientCreateWithoutQuotationsInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    invoices?: InvoiceCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutQuotationsInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
    invoices?: InvoiceUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutQuotationsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutQuotationsInput, ClientUncheckedCreateWithoutQuotationsInput>
  }

  export type QuotationLineItemUpsertWithWhereUniqueWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    update: XOR<QuotationLineItemUpdateWithoutQuotationInput, QuotationLineItemUncheckedUpdateWithoutQuotationInput>
    create: XOR<QuotationLineItemCreateWithoutQuotationInput, QuotationLineItemUncheckedCreateWithoutQuotationInput>
  }

  export type QuotationLineItemUpdateWithWhereUniqueWithoutQuotationInput = {
    where: QuotationLineItemWhereUniqueInput
    data: XOR<QuotationLineItemUpdateWithoutQuotationInput, QuotationLineItemUncheckedUpdateWithoutQuotationInput>
  }

  export type QuotationLineItemUpdateManyWithWhereWithoutQuotationInput = {
    where: QuotationLineItemScalarWhereInput
    data: XOR<QuotationLineItemUpdateManyMutationInput, QuotationLineItemUncheckedUpdateManyWithoutQuotationInput>
  }

  export type ClientUpsertWithoutQuotationsInput = {
    update: XOR<ClientUpdateWithoutQuotationsInput, ClientUncheckedUpdateWithoutQuotationsInput>
    create: XOR<ClientCreateWithoutQuotationsInput, ClientUncheckedCreateWithoutQuotationsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutQuotationsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutQuotationsInput, ClientUncheckedUpdateWithoutQuotationsInput>
  }

  export type ClientUpdateWithoutQuotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutQuotationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    invoices?: InvoiceUncheckedUpdateManyWithoutClientNestedInput
  }

  export type QuotationCreateWithoutLineItemsInput = {
    id?: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    client: ClientCreateNestedOneWithoutQuotationsInput
  }

  export type QuotationUncheckedCreateWithoutLineItemsInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
  }

  export type QuotationCreateOrConnectWithoutLineItemsInput = {
    where: QuotationWhereUniqueInput
    create: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
  }

  export type ProductCreateWithoutQuotationLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutQuotationLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutQuotationLinesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutQuotationLinesInput, ProductUncheckedCreateWithoutQuotationLinesInput>
  }

  export type QuotationUpsertWithoutLineItemsInput = {
    update: XOR<QuotationUpdateWithoutLineItemsInput, QuotationUncheckedUpdateWithoutLineItemsInput>
    create: XOR<QuotationCreateWithoutLineItemsInput, QuotationUncheckedCreateWithoutLineItemsInput>
    where?: QuotationWhereInput
  }

  export type QuotationUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: QuotationWhereInput
    data: XOR<QuotationUpdateWithoutLineItemsInput, QuotationUncheckedUpdateWithoutLineItemsInput>
  }

  export type QuotationUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    client?: ClientUpdateOneRequiredWithoutQuotationsNestedInput
  }

  export type QuotationUncheckedUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductUpsertWithoutQuotationLinesInput = {
    update: XOR<ProductUpdateWithoutQuotationLinesInput, ProductUncheckedUpdateWithoutQuotationLinesInput>
    create: XOR<ProductCreateWithoutQuotationLinesInput, ProductUncheckedCreateWithoutQuotationLinesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutQuotationLinesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutQuotationLinesInput, ProductUncheckedUpdateWithoutQuotationLinesInput>
  }

  export type ProductUpdateWithoutQuotationLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutQuotationLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type InvoiceCreateWithoutLineItemsInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    client: ClientCreateNestedOneWithoutInvoicesInput
    payments?: PaymentCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutLineItemsInput = {
    id?: string
    clientId: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
    payments?: PaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutLineItemsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
  }

  export type ProductCreateWithoutInvoiceLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    quotationLines?: QuotationLineItemCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutInvoiceLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    quotationLines?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
    purchaseLines?: PurchaseLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutInvoiceLinesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutInvoiceLinesInput, ProductUncheckedCreateWithoutInvoiceLinesInput>
  }

  export type InvoiceUpsertWithoutLineItemsInput = {
    update: XOR<InvoiceUpdateWithoutLineItemsInput, InvoiceUncheckedUpdateWithoutLineItemsInput>
    create: XOR<InvoiceCreateWithoutLineItemsInput, InvoiceUncheckedCreateWithoutLineItemsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutLineItemsInput, InvoiceUncheckedUpdateWithoutLineItemsInput>
  }

  export type InvoiceUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    client?: ClientUpdateOneRequiredWithoutInvoicesNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type ProductUpsertWithoutInvoiceLinesInput = {
    update: XOR<ProductUpdateWithoutInvoiceLinesInput, ProductUncheckedUpdateWithoutInvoiceLinesInput>
    create: XOR<ProductCreateWithoutInvoiceLinesInput, ProductUncheckedCreateWithoutInvoiceLinesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutInvoiceLinesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutInvoiceLinesInput, ProductUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type ProductUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotationLines?: QuotationLineItemUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotationLines?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
    purchaseLines?: PurchaseLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type UserCreateWithoutCreatedAuditsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: string
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    failedLogins?: number
    isLockedOut?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUncheckedCreateWithoutCreatedAuditsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: string
    lastLoginAt?: Date | string | null
    lastLoginIp?: string | null
    failedLogins?: number
    isLockedOut?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserCreateOrConnectWithoutCreatedAuditsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedAuditsInput, UserUncheckedCreateWithoutCreatedAuditsInput>
  }

  export type UserUpsertWithoutCreatedAuditsInput = {
    update: XOR<UserUpdateWithoutCreatedAuditsInput, UserUncheckedUpdateWithoutCreatedAuditsInput>
    create: XOR<UserCreateWithoutCreatedAuditsInput, UserUncheckedCreateWithoutCreatedAuditsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedAuditsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedAuditsInput, UserUncheckedUpdateWithoutCreatedAuditsInput>
  }

  export type UserUpdateWithoutCreatedAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateWithoutCreatedAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginIp?: NullableStringFieldUpdateOperationsInput | string | null
    failedLogins?: IntFieldUpdateOperationsInput | number
    isLockedOut?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PurchaseCreateWithoutVendorInput = {
    id?: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    lineItems?: PurchaseLineItemCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseUncheckedCreateWithoutVendorInput = {
    id?: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    lineItems?: PurchaseLineItemUncheckedCreateNestedManyWithoutPurchaseInput
  }

  export type PurchaseCreateOrConnectWithoutVendorInput = {
    where: PurchaseWhereUniqueInput
    create: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseCreateManyVendorInputEnvelope = {
    data: PurchaseCreateManyVendorInput | PurchaseCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type PurchaseUpsertWithWhereUniqueWithoutVendorInput = {
    where: PurchaseWhereUniqueInput
    update: XOR<PurchaseUpdateWithoutVendorInput, PurchaseUncheckedUpdateWithoutVendorInput>
    create: XOR<PurchaseCreateWithoutVendorInput, PurchaseUncheckedCreateWithoutVendorInput>
  }

  export type PurchaseUpdateWithWhereUniqueWithoutVendorInput = {
    where: PurchaseWhereUniqueInput
    data: XOR<PurchaseUpdateWithoutVendorInput, PurchaseUncheckedUpdateWithoutVendorInput>
  }

  export type PurchaseUpdateManyWithWhereWithoutVendorInput = {
    where: PurchaseScalarWhereInput
    data: XOR<PurchaseUpdateManyMutationInput, PurchaseUncheckedUpdateManyWithoutVendorInput>
  }

  export type PurchaseScalarWhereInput = {
    AND?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    OR?: PurchaseScalarWhereInput[]
    NOT?: PurchaseScalarWhereInput | PurchaseScalarWhereInput[]
    id?: StringFilter<"Purchase"> | string
    vendorId?: StringFilter<"Purchase"> | string
    sequenceNumber?: IntFilter<"Purchase"> | number
    purchaseNo?: StringFilter<"Purchase"> | string
    date?: DateTimeFilter<"Purchase"> | Date | string
    gstType?: StringFilter<"Purchase"> | string
    subTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Purchase"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Purchase"> | string
    ewayBill?: StringNullableFilter<"Purchase"> | string | null
    ewayBillUrl?: StringNullableFilter<"Purchase"> | string | null
    vehicleNo?: StringNullableFilter<"Purchase"> | string | null
    dispatchedThrough?: StringNullableFilter<"Purchase"> | string | null
    createdAt?: DateTimeFilter<"Purchase"> | Date | string
    updatedAt?: DateTimeFilter<"Purchase"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Purchase"> | Date | string | null
    createdById?: StringNullableFilter<"Purchase"> | string | null
    notes?: StringNullableFilter<"Purchase"> | string | null
  }

  export type PurchaseLineItemCreateWithoutPurchaseInput = {
    id?: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
    product?: ProductCreateNestedOneWithoutPurchaseLinesInput
  }

  export type PurchaseLineItemUncheckedCreateWithoutPurchaseInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemCreateOrConnectWithoutPurchaseInput = {
    where: PurchaseLineItemWhereUniqueInput
    create: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput>
  }

  export type PurchaseLineItemCreateManyPurchaseInputEnvelope = {
    data: PurchaseLineItemCreateManyPurchaseInput | PurchaseLineItemCreateManyPurchaseInput[]
    skipDuplicates?: boolean
  }

  export type VendorCreateWithoutPurchasesInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
  }

  export type VendorUncheckedCreateWithoutPurchasesInput = {
    id?: string
    name: string
    gst?: string | null
    email?: string | null
    phone?: string | null
    address1: string
    address2?: string | null
    state: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    pinCode?: string | null
    active?: boolean
  }

  export type VendorCreateOrConnectWithoutPurchasesInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutPurchasesInput, VendorUncheckedCreateWithoutPurchasesInput>
  }

  export type PurchaseLineItemUpsertWithWhereUniqueWithoutPurchaseInput = {
    where: PurchaseLineItemWhereUniqueInput
    update: XOR<PurchaseLineItemUpdateWithoutPurchaseInput, PurchaseLineItemUncheckedUpdateWithoutPurchaseInput>
    create: XOR<PurchaseLineItemCreateWithoutPurchaseInput, PurchaseLineItemUncheckedCreateWithoutPurchaseInput>
  }

  export type PurchaseLineItemUpdateWithWhereUniqueWithoutPurchaseInput = {
    where: PurchaseLineItemWhereUniqueInput
    data: XOR<PurchaseLineItemUpdateWithoutPurchaseInput, PurchaseLineItemUncheckedUpdateWithoutPurchaseInput>
  }

  export type PurchaseLineItemUpdateManyWithWhereWithoutPurchaseInput = {
    where: PurchaseLineItemScalarWhereInput
    data: XOR<PurchaseLineItemUpdateManyMutationInput, PurchaseLineItemUncheckedUpdateManyWithoutPurchaseInput>
  }

  export type VendorUpsertWithoutPurchasesInput = {
    update: XOR<VendorUpdateWithoutPurchasesInput, VendorUncheckedUpdateWithoutPurchasesInput>
    create: XOR<VendorCreateWithoutPurchasesInput, VendorUncheckedCreateWithoutPurchasesInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutPurchasesInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutPurchasesInput, VendorUncheckedUpdateWithoutPurchasesInput>
  }

  export type VendorUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateWithoutPurchasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gst?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address1?: StringFieldUpdateOperationsInput | string
    address2?: NullableStringFieldUpdateOperationsInput | string | null
    state?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    pinCode?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PurchaseCreateWithoutLineItemsInput = {
    id?: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    vendor: VendorCreateNestedOneWithoutPurchasesInput
  }

  export type PurchaseUncheckedCreateWithoutLineItemsInput = {
    id?: string
    vendorId: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
  }

  export type PurchaseCreateOrConnectWithoutLineItemsInput = {
    where: PurchaseWhereUniqueInput
    create: XOR<PurchaseCreateWithoutLineItemsInput, PurchaseUncheckedCreateWithoutLineItemsInput>
  }

  export type ProductCreateWithoutPurchaseLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemCreateNestedManyWithoutProductInput
    quotationLines?: QuotationLineItemCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutPurchaseLinesInput = {
    id?: string
    sku?: string | null
    description: string
    hsn?: string | null
    gstRate: Decimal | DecimalJsLike | number | string
    unit?: string
    notes?: string | null
    pkgType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    active?: boolean
    purchaseRate?: Decimal | DecimalJsLike | number | string
    sellingRate?: Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedCreateNestedManyWithoutProductInput
    quotationLines?: QuotationLineItemUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutPurchaseLinesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutPurchaseLinesInput, ProductUncheckedCreateWithoutPurchaseLinesInput>
  }

  export type PurchaseUpsertWithoutLineItemsInput = {
    update: XOR<PurchaseUpdateWithoutLineItemsInput, PurchaseUncheckedUpdateWithoutLineItemsInput>
    create: XOR<PurchaseCreateWithoutLineItemsInput, PurchaseUncheckedCreateWithoutLineItemsInput>
    where?: PurchaseWhereInput
  }

  export type PurchaseUpdateToOneWithWhereWithoutLineItemsInput = {
    where?: PurchaseWhereInput
    data: XOR<PurchaseUpdateWithoutLineItemsInput, PurchaseUncheckedUpdateWithoutLineItemsInput>
  }

  export type PurchaseUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    vendor?: VendorUpdateOneRequiredWithoutPurchasesNestedInput
  }

  export type PurchaseUncheckedUpdateWithoutLineItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vendorId?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProductUpsertWithoutPurchaseLinesInput = {
    update: XOR<ProductUpdateWithoutPurchaseLinesInput, ProductUncheckedUpdateWithoutPurchaseLinesInput>
    create: XOR<ProductCreateWithoutPurchaseLinesInput, ProductUncheckedCreateWithoutPurchaseLinesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutPurchaseLinesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutPurchaseLinesInput, ProductUncheckedUpdateWithoutPurchaseLinesInput>
  }

  export type ProductUpdateWithoutPurchaseLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUpdateManyWithoutProductNestedInput
    quotationLines?: QuotationLineItemUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutPurchaseLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    gstRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    purchaseRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    sellingRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoiceLines?: InvoiceLineItemUncheckedUpdateManyWithoutProductNestedInput
    quotationLines?: QuotationLineItemUncheckedUpdateManyWithoutProductNestedInput
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    action: string
    entityType: string
    entityId?: string | null
    details?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyClientInput = {
    id?: string
    sequenceNumber: number
    invoiceNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
    ewayBillUrl?: string | null
  }

  export type QuotationCreateManyClientInput = {
    id?: string
    sequenceNumber: number
    quotationNo: string
    date: Date | string
    validUntil?: Date | string | null
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    status?: string
    convertedInvoiceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    billingAddress1?: string | null
    billingAddress2?: string | null
    billingGst?: string | null
    billingName?: string | null
    billingPhone?: string | null
    billingPinCode?: string | null
    billingState?: string | null
    shippingAddress1?: string | null
    shippingAddress2?: string | null
    shippingName?: string | null
    shippingPinCode?: string | null
    shippingSameAsBilling?: boolean
    shippingState?: string | null
  }

  export type InvoiceUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: InvoiceLineItemUncheckedUpdateManyWithoutInvoiceNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    invoiceNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuotationUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: QuotationLineItemUpdateManyWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: QuotationLineItemUncheckedUpdateManyWithoutQuotationNestedInput
  }

  export type QuotationUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    quotationNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    validUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    convertedInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    billingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    billingGst?: NullableStringFieldUpdateOperationsInput | string | null
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    billingPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    billingState?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress1?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress2?: NullableStringFieldUpdateOperationsInput | string | null
    shippingName?: NullableStringFieldUpdateOperationsInput | string | null
    shippingPinCode?: NullableStringFieldUpdateOperationsInput | string | null
    shippingSameAsBilling?: BoolFieldUpdateOperationsInput | boolean
    shippingState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InvoiceLineItemCreateManyProductInput = {
    id?: string
    invoiceId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemCreateManyProductInput = {
    id?: string
    quotationId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemCreateManyProductInput = {
    id?: string
    purchaseId: string
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    invoice?: InvoiceUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type InvoiceLineItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    quotation?: QuotationUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type QuotationLineItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    quotationId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchase?: PurchaseUpdateOneRequiredWithoutLineItemsNestedInput
  }

  export type PurchaseLineItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    purchaseId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemCreateManyInvoiceInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PaymentCreateManyInvoiceInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    paidAt?: Date | string
    method: string
    reference?: string | null
    notes?: string | null
    recordedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineItemUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineItemUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type InvoiceLineItemUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PaymentUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paidAt?: DateTimeFieldUpdateOperationsInput | Date | string
    method?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    recordedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuotationLineItemCreateManyQuotationInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneWithoutQuotationLinesNestedInput
  }

  export type QuotationLineItemUncheckedUpdateWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type QuotationLineItemUncheckedUpdateManyWithoutQuotationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseCreateManyVendorInput = {
    id?: string
    sequenceNumber: number
    purchaseNo: string
    date: Date | string
    gstType: string
    subTotal: Decimal | DecimalJsLike | number | string
    taxTotal: Decimal | DecimalJsLike | number | string
    grandTotal: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    status?: string
    ewayBill?: string | null
    ewayBillUrl?: string | null
    vehicleNo?: string | null
    dispatchedThrough?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    createdById?: string | null
    notes?: string | null
  }

  export type PurchaseUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: PurchaseLineItemUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    lineItems?: PurchaseLineItemUncheckedUpdateManyWithoutPurchaseNestedInput
  }

  export type PurchaseUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNumber?: IntFieldUpdateOperationsInput | number
    purchaseNo?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    gstType?: StringFieldUpdateOperationsInput | string
    subTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grandTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    ewayBill?: NullableStringFieldUpdateOperationsInput | string | null
    ewayBillUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNo?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchedThrough?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PurchaseLineItemCreateManyPurchaseInput = {
    id?: string
    productId?: string | null
    description: string
    hsn?: string | null
    qty: Decimal | DecimalJsLike | number | string
    rate: Decimal | DecimalJsLike | number | string
    taxPercent: Decimal | DecimalJsLike | number | string
    taxAmount: Decimal | DecimalJsLike | number | string
    unit?: string
    pkgCount?: number | null
    pkgType?: string | null
    totalAmount: Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUpdateWithoutPurchaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    product?: ProductUpdateOneWithoutPurchaseLinesNestedInput
  }

  export type PurchaseLineItemUncheckedUpdateWithoutPurchaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PurchaseLineItemUncheckedUpdateManyWithoutPurchaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    hsn?: NullableStringFieldUpdateOperationsInput | string | null
    qty?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    rate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxPercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    taxAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unit?: StringFieldUpdateOperationsInput | string
    pkgCount?: NullableIntFieldUpdateOperationsInput | number | null
    pkgType?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}