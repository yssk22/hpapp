package models



func (MyEnum) Values() (types []string) {

	for _, r := range []MyEnum{
		MyEnumValueA,
		MyEnumValueB,
	} {
		types = append(types, string(r))
	}
	return
}
