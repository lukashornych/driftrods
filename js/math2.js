//interpolation between two numbers
Math.lerp = function (a, b, p)
{
    //correct P value (must be between 0 and 1)
    p = p < 0 ? 0 : p;
    p = p > 1 ? 1 : p;
    return a + ((b-a) * p);
}

Math.clamp = function (value)
{
    var newValue;
    if (value > 1)
    {
        newValue = 1;
    }
    else if (value < -1)
    {
        newValue = -1;
    }
    else
    {
        newValue = value;
    }
    return newValue
}
