import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { ObjectId } from 'mongodb';


@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, ObjectId> {
description = 'Mongo ObjectId scalar';


parseValue(value: string): ObjectId {
return new ObjectId(value);
}
serialize(value: ObjectId | string): string {
return value instanceof ObjectId ? value.toHexString() : String(value);
}
parseLiteral(ast: ValueNode): ObjectId {
if (ast.kind === Kind.STRING) return new ObjectId(ast.value);
throw new Error('ObjectId must be a string');
}
}