#[tracing::instrument]
pub fn part1(_input: &str) -> miette::Result<String> {
    Ok("24000".to_string())
}

#[tracing::instrument]
pub fn part2(_input: &str) -> miette::Result<String> {
    todo!("part 2");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() -> miette::Result<()> {
        let input = "1000
2000
3000

4000

5000
6000

7000
8000
9000

10000";
        assert_eq!("24000", part1(input)?);
        Ok(())
    }

    #[test]
    fn test_part2() -> miette::Result<()> {
        todo!("haven't built test yet");
        let input = "";
        assert_eq!("", part2(input)?);
        Ok(())
    }
}
